import React, { useState } from 'react';
import { UserProfile, LearningSession, ModerationFlag, Appeal } from '../types';
import { BADGE_DEFINITIONS } from '../services/badgeService';
import {
  X, Users, BookOpen, CheckCircle2, Star, AlertTriangle, Shield,
  BarChart3, Award, FileText, Eye, XCircle, Check, Clock, Flag,
  ArrowLeft, GraduationCap, TrendingUp, MessageSquare
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
  onBack: () => void;
}

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
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'sessions' | 'moderation' | 'appeals' | 'recognition'>('dashboard');

  const completedSessions = allSessions.filter((s) => s.status === 'completed');
  const pendingFlags = moderationFlags.filter((f) => f.status === 'pending');
  const pendingAppeals = appeals.filter((a) => a.status === 'pending');
  const avgRating = allStudents.length > 0
    ? (allStudents.reduce((s, u) => s + u.averageRating, 0) / allStudents.length).toFixed(1)
    : '0.0';

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'sessions' as const, label: 'Sessions', icon: BookOpen },
    { id: 'moderation' as const, label: 'Moderation', icon: Shield, badge: pendingFlags.length },
    { id: 'appeals' as const, label: 'Appeals', icon: FileText, badge: pendingAppeals.length },
    { id: 'recognition' as const, label: 'Recognition', icon: Award },
  ];

  // Certificate eligibility
  const eligibleStudents = allStudents.filter((s) => {
    return s.completedSessions >= 5 && s.averageRating >= 4.0 && s.badges.length >= 3 && s.hoursLearned >= 3 && s.strikes === 0;
  });

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
            {tab.badge && tab.badge > 0 && (
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">Institution Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Active Students', value: allStudents.length, icon: Users, color: 'text-sky-600 bg-sky-50' },
                { label: 'Total Sessions', value: allSessions.length, icon: BookOpen, color: 'text-teal-600 bg-teal-50' },
                { label: 'Completed', value: completedSessions.length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Avg Rating', value: avgRating, icon: Star, color: 'text-amber-600 bg-amber-50' },
                { label: 'Pending Flags', value: pendingFlags.length, icon: Flag, color: 'text-rose-600 bg-rose-50' },
                { label: 'Appeals', value: pendingAppeals.length, icon: FileText, color: 'text-violet-600 bg-violet-50' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 font-mono block">{stat.value}</span>
                  <span className="text-[10px] text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">Registered Students</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600">Student</th>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600 hidden sm:table-cell">Department</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600">Sessions</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600">Rating</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600">Badges</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600">Strikes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 flex items-center space-x-2">
                        <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-slate-900">{student.name}</span>
                          {student.suspended && <span className="ml-1 text-[9px] bg-rose-100 text-rose-700 px-1 rounded">Suspended</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{student.department}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold">{student.completedSessions}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-mono font-bold">{student.averageRating.toFixed(1)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{student.badges.length}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${student.strikes > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{student.strikes}/3</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">All Sessions</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600">Trainer</th>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600">Trainee</th>
                    <th className="text-left px-4 py-2.5 font-bold text-slate-600">Skill</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600">Session #</th>
                    <th className="text-center px-4 py-2.5 font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold">{session.trainerName}</td>
                      <td className="px-4 py-3 font-semibold">{session.traineeName}</td>
                      <td className="px-4 py-3 text-slate-700">{session.skill}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold">#{session.sessionNumber}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          session.status === 'active' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          session.status === 'accepted' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                          'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>{session.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">Moderation Queue</h2>
            {moderationFlags.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">No moderation flags</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-bold text-slate-600">Student</th>
                      <th className="text-left px-4 py-2.5 font-bold text-slate-600">Issue</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600">Severity</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600">Strike</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600">Status</th>
                      <th className="text-center px-4 py-2.5 font-bold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {moderationFlags.map((flag) => (
                      <tr key={flag.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <img src={flag.userAvatar} alt={flag.userName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-bold text-slate-900">{flag.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800">{flag.category}</span>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">"{flag.messageContent}"</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            flag.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                            flag.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            flag.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>{flag.severity}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-rose-600">
                          {flag.strikeIssued ? 'Yes' : 'No'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            flag.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            flag.status === 'actioned' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-300 cursor-pointer"
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

        {/* Appeals Tab */}
        {activeTab === 'appeals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">Student Appeals</h2>
            {appeals.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">No appeals submitted</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appeals.map((appeal) => (
                  <div key={appeal.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img src={appeal.userAvatar} alt={appeal.userName} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{appeal.userName}</h4>
                          <span className="text-[10px] text-slate-500">Submitted {appeal.submittedAt}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        appeal.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        appeal.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>{appeal.status}</span>
                    </div>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg italic">"{appeal.reason}"</p>
                    {appeal.status === 'pending' && (
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          type="button"
                          onClick={() => onAcceptAppeal(appeal.id)}
                          className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Appeal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectAppeal(appeal.id)}
                          className="flex-1 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 cursor-pointer flex items-center justify-center space-x-1"
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

        {/* Recognition Tab */}
        {activeTab === 'recognition' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">Institution-Controlled Recognition</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Eligibility Criteria</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  { label: 'Min Sessions', value: '5' },
                  { label: 'Min Rating', value: '4.0+' },
                  { label: 'Required Badges', value: '3+' },
                  { label: 'Min Learning Hours', value: '3h+' },
                  { label: 'Unresolved Violations', value: '0' },
                ].map((c) => (
                  <div key={c.label} className="bg-slate-50 rounded-lg p-2 text-center border border-slate-200">
                    <span className="block font-bold text-slate-900">{c.value}</span>
                    <span className="text-[10px] text-slate-500">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Eligible Students ({eligibleStudents.length})
              </h3>
              {eligibleStudents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No students currently meet all eligibility criteria.</p>
              ) : (
                <div className="space-y-2">
                  {eligibleStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                          <p className="text-[10px] text-slate-500">{student.completedSessions} sessions • {student.averageRating.toFixed(1)} rating • {student.badges.length} badges</p>
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
              <p className="text-[10px] text-slate-400 mt-4 italic">
                Note: The institution decides whether students receive certificates or academic recognition. SkillSwap does not automatically grant academic credits.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
