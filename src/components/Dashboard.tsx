import React from 'react';
import { UserProfile, LearningSession, AppNotification } from '../types';
import { BADGE_DEFINITIONS, getBadgeById } from '../services/badgeService';
import {
  BookOpen, Clock, Star, Award, GraduationCap, Search,
  ArrowRight, CheckCircle2, TrendingUp, Zap, Target
} from 'lucide-react';

interface DashboardProps {
  currentUser: UserProfile;
  sessions: LearningSession[];
  onFindSkill: () => void;
  onViewSessions: () => void;
  onViewBadge: (badgeId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  sessions,
  onFindSkill,
  onViewSessions,
}) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userSessions = sessions.filter(
    (s) => (s.trainerId === currentUser.id || s.traineeId === currentUser.id) && s.status === 'completed'
  );
  const recentSessions = sessions
    .filter((s) => s.trainerId === currentUser.id || s.traineeId === currentUser.id)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight font-outfit">
            {greeting()}, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Welcome to your SkillSwap dashboard at <strong className="text-white">{currentUser.college}</strong>
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-bold font-mono">{currentUser.completedSessions}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Completed Sessions</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span className="text-lg font-bold font-mono">{currentUser.hoursLearned}h</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Learning Hours</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-teal-400" />
                <span className="text-lg font-bold font-mono">{currentUser.hoursTaught}h</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Teaching Hours</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold font-mono">{currentUser.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Average Rating</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hidden sm:block">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Award className="w-4 h-4 text-violet-400" />
                <span className="text-lg font-bold font-mono">{currentUser.badges.length}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Badges Earned</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 opacity-5 pointer-events-none hidden md:block">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* NEP 2020 Banner */}
      <div className="nep-gradient rounded-xl px-4 py-3 border border-emerald-200/60 flex items-start sm:items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-emerald-700" />
        </div>
        <p className="text-[11px] sm:text-xs text-emerald-900/80 leading-relaxed">
          <span className="font-semibold text-emerald-900">SkillSwap</span> supports peer learning, multidisciplinary learning and holistic student development in alignment with the vision of <strong>NEP 2020</strong>.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onFindSkill}
          className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-md transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <Search className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Find a Skill</h3>
                <p className="text-[11px] text-slate-500">Browse peer mentors on campus</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        <button
          type="button"
          onClick={onViewSessions}
          className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <BookOpen className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">My Sessions</h3>
                <p className="text-[11px] text-slate-500">{sessions.filter(s => s.trainerId === currentUser.id || s.traineeId === currentUser.id).length} sessions total</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Skills I Can Teach */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-sky-500 mr-2" />
            Skills I Can Teach
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.skillsOffered.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-teal-500 mr-2" />
            Skills I Want to Learn
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {currentUser.skillsWanted.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
          <Award className="w-3.5 h-3.5 text-violet-600 mr-2" />
          Your Badges ({currentUser.badges.length}/{BADGE_DEFINITIONS.length})
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {BADGE_DEFINITIONS.map((badge) => {
            const earned = currentUser.badges.find((b) => b.badgeId === badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  earned
                    ? `${badge.bgColor} border ${badge.borderColor} shadow-xs`
                    : 'bg-slate-50 border border-slate-200 opacity-40 grayscale'
                }`}
                title={earned ? `${badge.name} — Earned ${earned.earnedAt}` : `${badge.name} — ${badge.requirement}`}
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className={`text-[9px] font-bold leading-tight ${earned ? badge.color : 'text-slate-500'}`}>
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Journey */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
          <TrendingUp className="w-3.5 h-3.5 text-sky-600 mr-2" />
          Your Learning Journey
        </h3>
        {recentSessions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            <Zap className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            <p>No sessions yet. Start your journey by finding a skill!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session) => {
              const isTrainer = session.trainerId === currentUser.id;
              const peerName = isTrainer ? session.traineeName : session.trainerName;
              const roleLabel = isTrainer ? 'Taught' : 'Learned';
              const roleColor = isTrainer ? 'text-teal-600 bg-teal-50 border-teal-200' : 'text-sky-600 bg-sky-50 border-sky-200';
              const statusColor = session.status === 'completed'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : session.status === 'accepted' || session.status === 'active'
                ? 'text-sky-700 bg-sky-50 border-sky-200'
                : session.status === 'requested'
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-slate-500 bg-slate-50 border-slate-200';

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">Session</span>
                      <span className="block text-sm font-bold text-slate-900 font-mono">#{session.sessionNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleColor}`}>
                          {roleLabel}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{session.skill}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isTrainer ? `to ${peerName}` : `from ${peerName}`} • {session.createdAt}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor} capitalize`}>
                    {session.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
