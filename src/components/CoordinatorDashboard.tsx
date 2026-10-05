import React, { useState, useEffect } from 'react';
import { UserProfile, LearningSession, ModerationFlag, Appeal, ModerationCase, AuditLogEntry, CoordinatorAction } from '../types';
import { BADGE_DEFINITIONS } from '../services/badgeService';
import {
  getModerationCases, resolveCase, getAuditLog, getReports
} from '../services/moderationService';
import {
  Users, BookOpen, CheckCircle2, Star, AlertTriangle, Shield,
  BarChart3, Award, FileText, XCircle, Check, Flag,
  ArrowLeft, ClipboardList, Ban, RefreshCw, AlertCircle, Info,
  ChevronDown, ChevronUp, Activity
} from 'lucide-react';

interface CoordinatorDashboardProps {
  allStudents: UserProfile[];
  allSessions: LearningSession[];
  moderationFlags: ModerationFlag[];
  appeals: Appeal[];
  onDismissFlag: (flagId: string) => void;
  onActionFlag: (flagId: string) => void;
  onAcceptAppeal: (appealId: string) => void;
  onRejectAppeal: (appealId: string) => void;
  onIssueCertificate: (userId: string) => void;
  onSuspendUser?: (userId: string) => void;
  onRestoreUser?: (userId: string) => void;
  onWarnUser?: (userId: string) => void;
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation Dialog
// ─────────────────────────────────────────────────────────────────────────────
const ConfirmDialog: React.FC<{
  title: string;
  message: string;
  actionLabel: string;
  actionClass: string;
  onConfirm: () => void;
  onCancel: () => void;
  noteInput?: boolean;
  noteValue?: string;
  onNoteChange?: (v: string) => void;
}> = ({ title, message, actionLabel, actionClass, onConfirm, onCancel, noteInput, noteValue, onNoteChange }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-sm bg-white dark:bg-[#0c1524] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-5 space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {noteInput && (
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Reason / Internal Note</label>
          <textarea
            rows={2}
            value={noteValue}
            onChange={(e) => onNoteChange?.(e.target.value)}
            placeholder="Add a reason or note for the audit log..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#101c30] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
      )}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 py-2 rounded-xl text-white text-xs font-bold cursor-pointer ${actionClass}`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Severity badge
// ─────────────────────────────────────────────────────────────────────────────
const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const styles: Record<string, string> = {
    critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${styles[severity] || styles.low}`}>
      {severity}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  allStudents,
  allSessions,
  moderationFlags,
  appeals,
  onDismissFlag,
  onActionFlag,
  onAcceptAppeal,
  onRejectAppeal,
  onIssueCertificate,
  onSuspendUser,
  onRestoreUser,
  onWarnUser,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'sessions' | 'moderation' | 'cases' | 'appeals' | 'audit' | 'recognition'>('dashboard');
  const [cases, setCases] = useState<ModerationCase[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    caseId: string;
    action: CoordinatorAction;
    title: string;
    message: string;
    actionLabel: string;
    actionClass: string;
    note: string;
  } | null>(null);

  // Refresh from localStorage whenever tab changes
  useEffect(() => {
    setCases(getModerationCases());
    setAuditLog(getAuditLog());
  }, [activeTab]);

  const refreshCases = () => {
    setCases(getModerationCases());
    setAuditLog(getAuditLog());
  };

  const completedSessions = allSessions.filter((s) => s.status === 'completed');
  const pendingFlags = moderationFlags.filter((f) => f.status === 'pending');
  const pendingAppeals = appeals.filter((a) => a.status === 'pending');
  const openCases = cases.filter((c) => c.status === 'open');
  const avgRating = allStudents.length > 0
    ? (allStudents.reduce((s, u) => s + u.averageRating, 0) / allStudents.length).toFixed(1)
    : '0.0';

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'sessions' as const, label: 'Sessions', icon: BookOpen },
    { id: 'moderation' as const, label: 'Flags', icon: Flag, badge: pendingFlags.length },
    { id: 'cases' as const, label: 'AI Cases', icon: Shield, badge: openCases.length },
    { id: 'appeals' as const, label: 'Appeals', icon: FileText, badge: pendingAppeals.length },
    { id: 'audit' as const, label: 'Audit Log', icon: ClipboardList },
    { id: 'recognition' as const, label: 'Recognition', icon: Award },
  ];

  const eligibleStudents = allStudents.filter((s) => {
    return s.completedSessions >= 5 && s.averageRating >= 4.0 && s.badges.length >= 3 && s.hoursLearned >= 3 && s.strikes === 0;
  });

  // ─── Coordinator action dispatch ────────────────────────────────────────────
  const handleCoordinatorAction = (
    c: ModerationCase,
    action: CoordinatorAction
  ) => {
    const descriptions: Record<CoordinatorAction, { title: string; message: string; actionLabel: string; actionClass: string }> = {
      dismiss: { title: 'Dismiss Case', message: `Dismiss this moderation case for ${c.userName}? The reports will be closed with no action.`, actionLabel: 'Dismiss', actionClass: 'bg-slate-600 hover:bg-slate-700' },
      warn: { title: 'Issue Warning', message: `Issue an official warning to ${c.userName}? This will be recorded in their profile and audit log.`, actionLabel: 'Issue Warning', actionClass: 'bg-amber-600 hover:bg-amber-700' },
      remove_content: { title: 'Remove Content', message: `Mark the flagged content for removal from ${c.userName}'s profile?`, actionLabel: 'Remove Content', actionClass: 'bg-orange-600 hover:bg-orange-700' },
      restrict: { title: 'Restrict User', message: `Restrict ${c.userName}'s account? They will have limited access to features.`, actionLabel: 'Restrict', actionClass: 'bg-orange-600 hover:bg-orange-700' },
      suspend: { title: 'Suspend User', message: `Suspend ${c.userName}'s account? They will not be able to access SkillSwap until restored by a coordinator.`, actionLabel: 'Suspend Account', actionClass: 'bg-rose-600 hover:bg-rose-700' },
      ban: { title: 'Permanently Ban User', message: `Permanently ban ${c.userName}? This is a serious action. Bans can only be reversed by a coordinator.`, actionLabel: 'Permanently Ban', actionClass: 'bg-rose-700 hover:bg-rose-800' },
      restore: { title: 'Restore Account', message: `Restore ${c.userName}'s account access? This will remove any active suspension or ban.`, actionLabel: 'Restore Access', actionClass: 'bg-emerald-600 hover:bg-emerald-700' },
    };

    const desc = descriptions[action];
    setConfirmDialog({
      caseId: c.id,
      action,
      title: desc.title,
      message: desc.message,
      actionLabel: desc.actionLabel,
      actionClass: desc.actionClass,
      note: '',
    });
  };

  const executeAction = () => {
    if (!confirmDialog) return;
    const { caseId, action, note } = confirmDialog;

    // Find the case to get userId
    const target = cases.find((c) => c.id === caseId);
    if (target) {
      // Apply user-level effects
      if (action === 'suspend' && onSuspendUser) onSuspendUser(target.userId);
      if (action === 'ban' && onSuspendUser) onSuspendUser(target.userId);
      if (action === 'restore' && onRestoreUser) onRestoreUser(target.userId);
      if (action === 'warn' && onWarnUser) onWarnUser(target.userId);
    }

    resolveCase(caseId, 'coordinator', action, note || undefined);
    setConfirmDialog(null);
    refreshCases();
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#07111F] text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar */}
      <div className="hidden md:flex coord-sidebar w-56 flex-col p-4 text-white shrink-0">
        <div className="flex items-center space-x-2 mb-8 px-1">
          <Shield className="w-5 h-5 text-sky-400" />
          <div>
            <span className="text-xs font-bold block">SKILLSWAP</span>
            <span className="text-[10px] text-slate-400">Institution Coordinator</span>
          </div>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold mb-1 transition-all cursor-pointer ${
              activeTab === tab.id ? 'bg-sky-600/30 text-sky-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </div>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">{tab.badge}</span>
            )}
          </button>
        ))}
        <div className="mt-auto">
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center space-x-2 px-3 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student View</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold">Coordinator</span>
        </div>
        <button onClick={onBack} className="text-xs text-slate-400 cursor-pointer">← Student View</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto md:max-h-screen">
        {/* Mobile Tab Bar */}
        <div className="md:hidden flex overflow-x-auto space-x-1 mb-4 mt-10 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab.label} {tab.badge && tab.badge > 0 ? `(${tab.badge})` : ''}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Institution Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: 'Active Students', value: allStudents.length, icon: Users, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
                { label: 'Total Sessions', value: allSessions.length, icon: BookOpen, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
                { label: 'Completed', value: completedSessions.length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
                { label: 'Avg Rating', value: avgRating, icon: Star, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
                { label: 'Pending Flags', value: pendingFlags.length, icon: Flag, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
                { label: 'Open Cases', value: openCases.length, icon: Shield, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40' },
                { label: 'Appeals', value: pendingAppeals.length, icon: FileText, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
                { label: 'Audit Entries', value: auditLog.length, icon: Activity, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-4 text-center">
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono block">{stat.value}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Quick escalated cases preview */}
            {openCases.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/50 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300">
                    {openCases.length} escalated case{openCases.length !== 1 ? 's' : ''} require{openCases.length === 1 ? 's' : ''} review
                  </h3>
                </div>
                {openCases.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1.5 border-t border-rose-100 dark:border-rose-800/30 first:border-t-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-rose-900 dark:text-rose-200">{c.userName}</span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400">{c.reportCount} report{c.reportCount !== 1 ? 's' : ''}</span>
                    </div>
                    {c.aiResult && <SeverityBadge severity={c.aiResult.severity} />}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setActiveTab('cases')}
                  className="mt-3 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  View all cases →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STUDENTS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Registered Students</h2>
            <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-[#0a1628] border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Student</th>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400 hidden sm:table-cell">Department</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Sessions</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Rating</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Badges</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Strikes</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {allStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 flex items-center space-x-2">
                        <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{student.department}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold dark:text-slate-300">{student.completedSessions}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-mono font-bold dark:text-slate-300">{student.averageRating.toFixed(1)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono dark:text-slate-300">{student.badges.length}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${student.strikes > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{student.strikes}/3</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {student.suspended ? (
                          <span className="text-[10px] bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold border border-rose-200 dark:border-rose-800">Suspended</span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SESSIONS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">All Sessions</h2>
            <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-[#0a1628] border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Trainer</th>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Trainee</th>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Skill</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Session #</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {allSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-white/2">
                      <td className="px-4 py-3 font-semibold dark:text-slate-200">{session.trainerName}</td>
                      <td className="px-4 py-3 font-semibold dark:text-slate-200">{session.traineeName}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-400">{session.skill}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold dark:text-slate-300">#{session.sessionNumber}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' :
                          session.status === 'active' ? 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800' :
                          session.status === 'accepted' ? 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800' :
                          'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>{session.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODERATION FLAGS TAB ─────────────────────────────────────────── */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Moderation Flags</h2>
            {moderationFlags.length === 0 ? (
              <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center text-xs text-slate-400">
                <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">No moderation flags</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-[#0a1628] border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Student</th>
                      <th className="text-left px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Issue</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Severity</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Strike</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Status</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600 dark:text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {moderationFlags.map((flag) => (
                      <tr key={flag.id} className="hover:bg-slate-50 dark:hover:bg-white/2">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <img src={flag.userAvatar} alt={flag.userName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-bold text-slate-900 dark:text-white">{flag.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{flag.category}</span>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5 line-clamp-1">"{flag.messageContent}"</p>
                          {flag.aiResult && (
                            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                              AI: {flag.aiResult.riskLevel} ({Math.round(flag.aiResult.confidence * 100)}%)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <SeverityBadge severity={flag.severity} />
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                          {flag.strikeIssued ? 'Yes' : 'No'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            flag.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' :
                            flag.status === 'actioned' ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                          }`}>{flag.status}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {flag.status === 'pending' && (
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                type="button"
                                onClick={() => onActionFlag(flag.id)}
                                className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                              >
                                Action
                              </button>
                              <button
                                type="button"
                                onClick={() => onDismissFlag(flag.id)}
                                className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold hover:bg-slate-300 cursor-pointer"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── AI MODERATION CASES TAB ──────────────────────────────────────── */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">AI Moderation Cases</h2>
              <button
                type="button"
                onClick={refreshCases}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="bg-sky-50 dark:bg-sky-950/20 rounded-xl border border-sky-200 dark:border-sky-800/50 p-3 text-xs text-sky-800 dark:text-sky-300 flex items-start space-x-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Cases are automatically escalated when a user receives ≥3 reports, or when AI detects a critical violation. The AI recommends actions — you make the final call.</p>
            </div>

            {cases.length === 0 ? (
              <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center text-xs text-slate-400">
                <Shield className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">No moderation cases yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cases.map((c) => {
                  const isExpanded = expandedCase === c.id;
                  const student = allStudents.find((s) => s.id === c.userId);
                  return (
                    <div
                      key={c.id}
                      className={`bg-white dark:bg-[#0c1524] rounded-xl border overflow-hidden transition-all ${
                        c.status === 'open' ? 'border-rose-200 dark:border-rose-800/50' :
                        c.status === 'resolved' ? 'border-emerald-200 dark:border-emerald-800/50' :
                        'border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {/* Case Header */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={student?.avatar || c.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={c.userName}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.userName}</h4>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{c.contentType}</span>
                                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{c.reportCount} report{c.reportCount !== 1 ? 's' : ''}</span>
                                {c.aiResult && (
                                  <span className={`text-[10px] font-bold ${
                                    c.aiResult.riskLevel === 'CRITICAL' ? 'text-rose-600 dark:text-rose-400' :
                                    c.aiResult.riskLevel === 'HIGH_RISK' ? 'text-orange-600 dark:text-orange-400' :
                                    c.aiResult.riskLevel === 'MEDIUM_RISK' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-slate-500 dark:text-slate-400'
                                  }`}>
                                    AI: {c.aiResult.riskLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              c.status === 'open' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' :
                              c.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' :
                              c.status === 'dismissed' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' :
                              'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                            }`}>
                              {c.status}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Content preview */}
                        <div className="mt-2 p-2 bg-slate-50 dark:bg-[#101c30] rounded-lg">
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-1">"{c.contentPreview}"</p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 dark:border-white/5 p-4 space-y-4">
                          {/* AI Result */}
                          {c.aiResult && (
                            <div className="p-3 bg-slate-50 dark:bg-[#101c30] rounded-xl space-y-2">
                              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">AI Classification</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                                <div className="text-center p-2 bg-white dark:bg-[#0c1524] rounded-lg border border-slate-100 dark:border-white/5">
                                  <span className="block font-bold text-slate-900 dark:text-white capitalize">{c.aiResult.status}</span>
                                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-[#0c1524] rounded-lg border border-slate-100 dark:border-white/5">
                                  <span className={`block font-bold capitalize ${
                                    c.aiResult.riskLevel === 'CRITICAL' ? 'text-rose-600 dark:text-rose-400' :
                                    c.aiResult.riskLevel === 'HIGH_RISK' ? 'text-orange-600 dark:text-orange-400' :
                                    'text-amber-600 dark:text-amber-400'
                                  }`}>{c.aiResult.riskLevel}</span>
                                  <span className="text-slate-500 dark:text-slate-400">Risk</span>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-[#0c1524] rounded-lg border border-slate-100 dark:border-white/5">
                                  <span className="block font-bold text-slate-900 dark:text-white">{Math.round(c.aiResult.confidence * 100)}%</span>
                                  <span className="text-slate-500 dark:text-slate-400">Confidence</span>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-[#0c1524] rounded-lg border border-slate-100 dark:border-white/5">
                                  <span className="block font-bold text-slate-900 dark:text-white capitalize">{c.aiResult.action}</span>
                                  <span className="text-slate-500 dark:text-slate-400">AI Recommends</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Categories:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {c.aiResult.categories.map((cat) => (
                                    <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                                      {cat.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">{c.aiResult.reason}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">Model: {c.aiResult.model} {c.aiResult.fallback ? '(fallback)' : ''}</p>
                            </div>
                          )}

                          {/* Reports list */}
                          {c.reports.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Reports ({c.reports.length})
                              </p>
                              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                {c.reports.map((r, i) => (
                                  <div key={r.id || i} className="p-2 bg-slate-50 dark:bg-[#101c30] rounded-lg text-[11px] flex items-start justify-between">
                                    <div>
                                      <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{r.category.replace(/_/g, ' ')}</span>
                                      {r.description && <p className="text-slate-500 dark:text-slate-400 italic">{r.description}</p>}
                                    </div>
                                    <span className="text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                                      {new Date(r.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Coordinator Actions */}
                          {c.status === 'open' && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Coordinator Actions</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                  { action: 'dismiss' as const, label: 'Dismiss', icon: XCircle, class: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700' },
                                  { action: 'warn' as const, label: 'Warn', icon: AlertCircle, class: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-950/60' },
                                  { action: 'remove_content' as const, label: 'Remove Content', icon: FileText, class: 'bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-950/60' },
                                  { action: 'restrict' as const, label: 'Restrict', icon: AlertTriangle, class: 'bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-950/60' },
                                  { action: 'suspend' as const, label: 'Suspend', icon: Ban, class: 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-950/60' },
                                  { action: 'ban' as const, label: 'Permanent Ban', icon: Ban, class: 'bg-rose-200 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 hover:bg-rose-300 dark:hover:bg-rose-950/80' },
                                ].map((btn) => (
                                  <button
                                    key={btn.action}
                                    type="button"
                                    id={`coord-action-${btn.action}-${c.id}`}
                                    onClick={() => handleCoordinatorAction(c, btn.action)}
                                    className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${btn.class}`}
                                  >
                                    <btn.icon className="w-3.5 h-3.5" />
                                    <span>{btn.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Restore option for resolved/suspended */}
                          {(c.coordinatorAction === 'suspend' || c.coordinatorAction === 'ban') && (
                            <button
                              type="button"
                              onClick={() => handleCoordinatorAction(c, 'restore')}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Restore Account Access</span>
                            </button>
                          )}

                          {/* Resolved info */}
                          {c.coordinatorAction && (
                            <div className="p-3 bg-slate-50 dark:bg-[#101c30] rounded-xl text-[11px] text-slate-600 dark:text-slate-400">
                              <p><span className="font-bold">Action taken:</span> {c.coordinatorAction.replace(/_/g, ' ')}</p>
                              {c.coordinatorNote && <p className="italic mt-1">Note: {c.coordinatorNote}</p>}
                              {c.resolvedAt && <p className="mt-1">Resolved: {new Date(c.resolvedAt).toLocaleString()}</p>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── APPEALS TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'appeals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Student Appeals</h2>
            {appeals.length === 0 ? (
              <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center text-xs text-slate-400">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">No appeals submitted</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appeals.map((appeal) => (
                  <div key={appeal.id} className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img src={appeal.userAvatar} alt={appeal.userName} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{appeal.userName}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">Submitted {appeal.submittedAt}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${
                        appeal.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' :
                        appeal.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' :
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                      }`}>{appeal.status}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#101c30] p-3 rounded-lg italic">"{appeal.reason}"</p>
                    {appeal.status === 'pending' && (
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          type="button"
                          onClick={() => { onAcceptAppeal(appeal.id); if (onRestoreUser) onRestoreUser(appeal.userId); }}
                          className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Restore</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectAppeal(appeal.id)}
                          className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AUDIT LOG TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Audit Log</h2>
              <button
                type="button"
                onClick={refreshCases}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
            {auditLog.length === 0 ? (
              <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center text-xs text-slate-400">
                <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">No audit entries yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {auditLog.map((entry) => {
                  const student = allStudents.find((s) => s.id === entry.userId);
                  return (
                    <div key={entry.id} className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {student?.avatar && (
                            <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {student?.name || entry.userId}
                              {entry.coordinatorAction && (
                                <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  entry.coordinatorAction === 'suspend' || entry.coordinatorAction === 'ban' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                                  entry.coordinatorAction === 'restore' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                                  entry.coordinatorAction === 'warn' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {entry.coordinatorAction.replace(/_/g, ' ')}
                                </span>
                              )}
                            </p>
                            {entry.reason && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">{entry.reason}</p>}
                            {entry.aiResult && (
                              <p className="text-[10px] text-sky-600 dark:text-sky-400">
                                AI: {entry.aiResult.riskLevel} | {entry.aiResult.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(entry.timestamp).toLocaleString()}</p>
                          {entry.previousStatus && entry.newStatus && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{entry.previousStatus} → {entry.newStatus}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── RECOGNITION TAB ──────────────────────────────────────────────── */}
        {activeTab === 'recognition' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Institution-Controlled Recognition</h2>
            <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Eligibility Criteria</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { label: 'Min Sessions', value: '5' },
                  { label: 'Min Rating', value: '4.0+' },
                  { label: 'Required Badges', value: '3+' },
                  { label: 'Min Learning Hours', value: '3h+' },
                  { label: 'Unresolved Violations', value: '0' },
                ].map((c) => (
                  <div key={c.label} className="bg-slate-50 dark:bg-[#101c30] rounded-lg p-2 text-center border border-slate-200 dark:border-white/5">
                    <span className="block font-bold text-slate-900 dark:text-white">{c.value}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c1524] rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                Eligible Students ({eligibleStudents.length})
              </h3>
              {eligibleStudents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No students currently meet all eligibility criteria.</p>
              ) : (
                <div className="space-y-2">
                  {eligibleStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/2">
                      <div className="flex items-center space-x-3">
                        <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{student.completedSessions} sessions • {student.averageRating.toFixed(1)} rating • {student.badges.length} badges</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onIssueCertificate(student.id)}
                        className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-bold hover:bg-amber-700 cursor-pointer flex items-center space-x-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Issue Certificate</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 italic">
                Note: The institution decides whether students receive certificates or academic recognition. SkillSwap does not automatically grant academic credits.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Overlay */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          actionLabel={confirmDialog.actionLabel}
          actionClass={confirmDialog.actionClass}
          onConfirm={executeAction}
          onCancel={() => setConfirmDialog(null)}
          noteInput
          noteValue={confirmDialog.note}
          onNoteChange={(v) => setConfirmDialog((prev) => prev ? { ...prev, note: v } : null)}
        />
      )}
    </div>
  );
};
