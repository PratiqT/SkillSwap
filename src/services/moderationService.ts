import { ModerationSeverity } from '../types';

export interface ModerationResult {
  flagged: boolean;
  category: string;
  severity: ModerationSeverity;
  reason: string;
}

interface DangerPattern {
  pattern: RegExp;
  category: string;
  severity: ModerationSeverity;
}

const DANGER_PATTERNS: DangerPattern[] = [
  // Credential theft
  { pattern: /send\s+(me\s+)?your\s+password/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /give\s+(me\s+)?your\s+otp/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /send\s+(your\s+)?credentials/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /share\s+(your\s+)?password/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /what('?s|\s+is)\s+your\s+password/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /tell\s+(me\s+)?(your\s+)?otp/i, category: 'Credential Theft', severity: 'high' },
  { pattern: /send\s+(me\s+)?your\s+login/i, category: 'Credential Theft', severity: 'high' },
  // Financial scams
  { pattern: /send\s+(me\s+)?money/i, category: 'Financial Scam', severity: 'high' },
  { pattern: /bank\s+account\s+(details|number)/i, category: 'Financial Scam', severity: 'high' },
  { pattern: /upi\s+pin/i, category: 'Financial Scam', severity: 'high' },
  { pattern: /pay\s+me\s+first/i, category: 'Financial Scam', severity: 'medium' },
  { pattern: /transfer\s+money/i, category: 'Financial Scam', severity: 'medium' },
  // Personal info harvesting
  { pattern: /send\s+(me\s+)?your\s+aadhaar/i, category: 'Personal Data Harvesting', severity: 'high' },
  { pattern: /share\s+(your\s+)?phone\s+number/i, category: 'Personal Data Harvesting', severity: 'medium' },
  { pattern: /send\s+(me\s+)?your\s+address/i, category: 'Personal Data Harvesting', severity: 'medium' },
  // Harassment
  { pattern: /i('ll| will)\s+(hurt|kill|harm)/i, category: 'Threat / Harassment', severity: 'critical' },
];

/**
 * Check a message for safety violations.
 * Uses local pattern matching now — designed to be replaced with Gemini AI later.
 */
export function checkMessage(text: string): ModerationResult {
  const cleanText = text.trim();
  if (!cleanText) {
    return { flagged: false, category: '', severity: 'low', reason: '' };
  }

  for (const { pattern, category, severity } of DANGER_PATTERNS) {
    if (pattern.test(cleanText)) {
      return {
        flagged: true,
        category,
        severity,
        reason: `Detected pattern matching "${category}" policy`,
      };
    }
  }

  return { flagged: false, category: '', severity: 'low', reason: '' };
}

/**
 * Strike policy:
 * Strike 1 → Warning issued
 * Strike 2 → Final Warning / Restrictions
 * Strike 3 → Suspension (pending coordinator review)
 */
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
