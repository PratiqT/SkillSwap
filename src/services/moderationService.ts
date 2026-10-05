/**
 * SkillSwap AI Moderation Service
 *
 * Architecture:
 *   Frontend → moderationService → /api/moderate (server) → Gemini AI
 *
 * The API key NEVER touches the browser.
 * If the server call fails, a regex-based fallback is used.
 * All moderation results are structured and validated.
 */

import {
  AIModerationResult,
  ContentReport,
  ModerationCase,
  ModerationFlag,
  ReportCategory,
  ModerationSeverity,
  AuditLogEntry,
  CoordinatorAction,
} from '../types';

// ============================================================================
// Storage Keys
// ============================================================================
const STORAGE_REPORTS = 'skillswap_content_reports';
const STORAGE_CASES = 'skillswap_moderation_cases';
const STORAGE_AUDIT = 'skillswap_audit_log';
const ESCALATION_THRESHOLD = 3; // reports before coordinator review

// ============================================================================
// Core AI Moderation Call
// ============================================================================

/**
 * Classify content using Gemini AI via the server endpoint.
 * Never exposes API keys to the browser.
 * Fails gracefully on network/AI errors.
 */
export async function moderateContent(
  content: string,
  contentType: 'chat' | 'bio' | 'skill' | 'credential' | 'review' | 'report' | 'headline' | 'profile' = 'chat'
): Promise<AIModerationResult> {
  const trimmed = content?.trim() ?? '';

  if (!trimmed) {
    return buildSafeResult('Empty content');
  }

  try {
    const response = await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: trimmed, contentType }),
    });

    if (!response.ok) {
      console.warn('[moderationService] Server returned', response.status, '— using fallback');
      return regexFallback(trimmed);
    }

    const data = await response.json();

    // Validate the shape coming back
    if (!data || typeof data.status !== 'string') {
      console.warn('[moderationService] Malformed server response — using fallback');
      return regexFallback(trimmed);
    }

    return data as AIModerationResult;
  } catch (err) {
    console.error('[moderationService] Network error:', err);
    return regexFallback(trimmed);
  }
}

// ============================================================================
// Backward-compatible sync check (still used by existing ChatModule)
// ============================================================================

export interface ModerationResult {
  flagged: boolean;
  category: string;
  severity: ModerationSeverity;
  reason: string;
}

const DANGER_PATTERNS: Array<{ pattern: RegExp; category: string; severity: ModerationSeverity }> = [
  { pattern: /send\s+(me\s+)?your\s+password/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /give\s+(me\s+)?your\s+otp/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /send\s+(your\s+)?credentials/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /share\s+(your\s+)?password/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /what('?s|\s+is)\s+your\s+password/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /tell\s+(me\s+)?(your\s+)?otp/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /send\s+(me\s+)?your\s+login/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /send\s+(me\s+)?money/i, category: 'Financial Scam', severity: 'high' },
  { pattern: /bank\s+account\s+(details|number)/i, category: 'Financial Scam', severity: 'high' },
  { pattern: /upi\s+pin/i, category: 'Financial Scam', severity: 'high' },
  { pattern: /pay\s+me\s+first/i, category: 'Financial Scam', severity: 'medium' },
  { pattern: /transfer\s+money/i, category: 'Financial Scam', severity: 'medium' },
  { pattern: /send\s+(me\s+)?your\s+aadhaar/i, category: 'Personal Data Harvesting', severity: 'high' },
  { pattern: /share\s+(your\s+)?phone\s+number/i, category: 'Personal Data Harvesting', severity: 'medium' },
  { pattern: /send\s+(me\s+)?your\s+address/i, category: 'Personal Data Harvesting', severity: 'medium' },
  { pattern: /i('ll| will)\s+(hurt|kill|harm)/i, category: 'Threat / Harassment', severity: 'critical' },
  { pattern: /send\s+(me\s+)?(explicit|nude|naked)\s+(photo|pic|image)/i, category: 'Sexual Inappropriate', severity: 'critical' },
  { pattern: /you\s+are\s+(stupid|idiot|useless|worthless|dumb)|nobody\s+wants\s+you/i, category: 'Harassment', severity: 'high' },
];

/** Synchronous regex check — kept for backward compatibility */
export function checkMessage(text: string): ModerationResult {
  const cleanText = text.trim();
  if (!cleanText) return { flagged: false, category: '', severity: 'low', reason: '' };

  for (const { pattern, category, severity } of DANGER_PATTERNS) {
    if (pattern.test(cleanText)) {
      return { flagged: true, category, severity, reason: `Detected pattern matching "${category}" policy` };
    }
  }
  return { flagged: false, category: '', severity: 'low', reason: '' };
}

// ============================================================================
// Strike Policy
// ============================================================================

export function getStrikeAction(strikeCount: number): {
  action: string;
  description: string;
  suspended: boolean;
} {
  switch (strikeCount) {
    case 1:
      return {
        action: 'Warning Issued',
        description: 'A warning has been recorded on your profile. Please follow community guidelines.',
        suspended: false,
      };
    case 2:
      return {
        action: 'Final Warning',
        description: 'This is your final warning. One more violation will result in account suspension.',
        suspended: false,
      };
    case 3:
    default:
      return {
        action: 'Account Suspended',
        description: 'Your account has been suspended pending review by the institution coordinator.',
        suspended: true,
      };
  }
}

// ============================================================================
// Content Reporting — localStorage-backed
// ============================================================================

export function getReports(): ContentReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: ContentReport[]): void {
  try {
    localStorage.setItem(STORAGE_REPORTS, JSON.stringify(reports));
  } catch (err) {
    console.error('[moderationService] Could not save reports:', err);
  }
}

/**
 * Submit a user report.
 * Returns null if this user already reported this content (duplicate prevention).
 */
export function submitReport(
  report: Omit<ContentReport, 'id' | 'timestamp' | 'status'>
): ContentReport | null {
  const existing = getReports();

  // Deduplicate: same reporter + same reported user + same content type + same preview
  const isDuplicate = existing.some(
    (r) =>
      r.reporterId === report.reporterId &&
      r.reportedUserId === report.reportedUserId &&
      r.contentType === report.contentType &&
      r.contentPreview.slice(0, 50) === report.contentPreview.slice(0, 50)
  );

  if (isDuplicate) return null;

  const newReport: ContentReport = {
    ...report,
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  const updated = [newReport, ...existing];
  saveReports(updated);

  // Check escalation threshold
  checkEscalationThreshold(newReport);

  return newReport;
}

/** Count pending reports for a specific user */
export function getReportCountForUser(userId: string): number {
  return getReports().filter((r) => r.reportedUserId === userId && r.status === 'pending').length;
}

// ============================================================================
// Moderation Cases — escalation when >= 3 reports
// ============================================================================

export function getModerationCases(): ModerationCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_CASES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveModerationCases(cases: ModerationCase[]): void {
  try {
    localStorage.setItem(STORAGE_CASES, JSON.stringify(cases));
  } catch {}
}

function checkEscalationThreshold(newReport: ContentReport): void {
  const allReports = getReports();
  const userReports = allReports.filter(
    (r) => r.reportedUserId === newReport.reportedUserId && r.status === 'pending'
  );

  if (userReports.length >= ESCALATION_THRESHOLD) {
    const existing = getModerationCases();
    const hasOpenCase = existing.some(
      (c) => c.userId === newReport.reportedUserId && c.status === 'open'
    );
    if (!hasOpenCase) {
      const newCase: ModerationCase = {
        id: `case-${Date.now()}`,
        userId: newReport.reportedUserId,
        userName: newReport.reportedUserName,
        userAvatar: '',
        contentType: newReport.contentType,
        contentPreview: newReport.contentPreview,
        reportCount: userReports.length,
        reports: userReports,
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      saveModerationCases([newCase, ...existing]);
    } else {
      const updated = existing.map((c) =>
        c.userId === newReport.reportedUserId && c.status === 'open'
          ? { ...c, reportCount: userReports.length, reports: userReports }
          : c
      );
      saveModerationCases(updated);
    }
  }
}

/** Create or update a moderation case with an AI result (e.g., from chat block) */
export function createOrUpdateCaseWithAI(
  userId: string,
  userName: string,
  userAvatar: string,
  contentType: ModerationCase['contentType'],
  contentPreview: string,
  aiResult: AIModerationResult,
  flagId?: string
): ModerationCase {
  const existing = getModerationCases();
  const reports = getReports().filter((r) => r.reportedUserId === userId);

  const existingOpen = existing.find((c) => c.userId === userId && c.status === 'open');
  if (existingOpen) {
    const updated = {
      ...existingOpen,
      aiResult,
      reportCount: Math.max(existingOpen.reportCount, reports.length),
      flagId: flagId || existingOpen.flagId,
    };
    saveModerationCases(existing.map((c) => (c.id === existingOpen.id ? updated : c)));
    return updated;
  }

  const newCase: ModerationCase = {
    id: `case-${Date.now()}`,
    userId,
    userName,
    userAvatar,
    contentType,
    contentPreview,
    aiResult,
    reportCount: reports.length,
    reports,
    status: 'open',
    createdAt: new Date().toISOString(),
    flagId,
  };
  saveModerationCases([newCase, ...existing]);
  return newCase;
}

// ============================================================================
// Coordinator Actions
// ============================================================================

export function resolveCase(
  caseId: string,
  coordinatorId: string,
  action: CoordinatorAction,
  reason?: string
): ModerationCase | null {
  const cases = getModerationCases();
  const target = cases.find((c) => c.id === caseId);
  if (!target) return null;

  const resolved: ModerationCase = {
    ...target,
    status: action === 'dismiss' ? 'dismissed' : 'resolved',
    coordinatorAction: action,
    coordinatorId,
    coordinatorNote: reason,
    resolvedAt: new Date().toISOString(),
  };

  saveModerationCases(cases.map((c) => (c.id === caseId ? resolved : c)));
  addAuditEntry({
    caseId,
    userId: target.userId,
    aiResult: target.aiResult,
    reports: target.reports,
    coordinatorAction: action,
    coordinatorId,
    reason,
    previousStatus: target.status,
    newStatus: resolved.status,
  });

  return resolved;
}

// ============================================================================
// Audit Log
// ============================================================================

export function getAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    reports: entry.reports ?? [],
  };
  try {
    const existing = getAuditLog();
    localStorage.setItem(STORAGE_AUDIT, JSON.stringify([newEntry, ...existing].slice(0, 500)));
  } catch {}
  return newEntry;
}

// ============================================================================
// Helper: Build a "safe" result
// ============================================================================

function buildSafeResult(reason: string): AIModerationResult {
  return {
    status: 'safe',
    severity: 'low',
    riskLevel: 'SAFE',
    categories: ['safe'],
    confidence: 1.0,
    reason,
    action: 'allow',
    moderatedAt: new Date().toISOString(),
    model: 'none',
  };
}

// ============================================================================
// Regex fallback (used when server call fails, identical logic as server)
// ============================================================================

function regexFallback(text: string): AIModerationResult {
  const patterns: Array<{
    re: RegExp;
    category: AIModerationResult['categories'][number];
    severity: ModerationSeverity;
    action: AIModerationResult['action'];
    riskLevel: AIModerationResult['riskLevel'];
  }> = [
    { re: /send\s+(me\s+)?your\s+password|give\s+(me\s+)?your\s+otp|share\s+(your\s+)?password|what.?s\s+your\s+password|tell\s+(me\s+)?(your\s+)?otp|send\s+(me\s+)?your\s+login/i, category: 'credential_theft', severity: 'high', action: 'block', riskLevel: 'HIGH_RISK' },
    { re: /send\s+(me\s+)?money|bank\s+account\s+(details|number)|upi\s+pin|pay\s+me\s+first|transfer\s+money/i, category: 'financial_scam', severity: 'high', action: 'block', riskLevel: 'HIGH_RISK' },
    { re: /send\s+(me\s+)?your\s+aadhaar|share\s+(your\s+)?phone\s+number|send\s+(me\s+)?your\s+address/i, category: 'privacy_violation', severity: 'medium', action: 'review', riskLevel: 'MEDIUM_RISK' },
    { re: /i('ll| will)\s+(hurt|kill|harm)/i, category: 'threats_violence', severity: 'critical', action: 'block', riskLevel: 'CRITICAL' },
    { re: /send\s+(me\s+)?(explicit|nude|naked)\s+(photo|pic|image)/i, category: 'sexual_inappropriate', severity: 'critical', action: 'block', riskLevel: 'CRITICAL' },
    { re: /you\s+are\s+(stupid|idiot|useless|worthless|dumb)|nobody\s+wants\s+you/i, category: 'harassment', severity: 'high', action: 'review', riskLevel: 'HIGH_RISK' },
    { re: /click\s+(this|here)\s+link.*?(send|give|share)/i, category: 'malicious_links', severity: 'high', action: 'block', riskLevel: 'HIGH_RISK' },
  ];

  for (const p of patterns) {
    if (p.re.test(text)) {
      return {
        status: p.severity === 'critical' || p.action === 'block' ? 'blocked' : 'flagged',
        severity: p.severity,
        riskLevel: p.riskLevel,
        categories: [p.category],
        confidence: 0.85,
        reason: `Detected pattern: ${p.category.replace(/_/g, ' ')}`,
        action: p.action,
        moderatedAt: new Date().toISOString(),
        model: 'regex-fallback',
        fallback: true,
      };
    }
  }

  return {
    status: 'safe',
    severity: 'low',
    riskLevel: 'SAFE',
    categories: ['safe'],
    confidence: 0.9,
    reason: 'No violations detected',
    action: 'allow',
    moderatedAt: new Date().toISOString(),
    model: 'regex-fallback',
    fallback: true,
  };
}
