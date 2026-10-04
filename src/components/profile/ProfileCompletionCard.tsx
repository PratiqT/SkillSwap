import React from 'react';
import { UserProfile } from '../../types';
import { Sparkles, CheckCircle2, ArrowRight, Plus } from 'lucide-react';

interface ProfileCompletionCardProps {
  user: UserProfile;
  onEditProfile?: () => void;
  onAddSkill?: () => void;
  onAddCredential?: () => void;
  onAddProject?: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  user,
  onEditProfile,
  onAddSkill,
  onAddCredential,
  onAddProject,
}) => {
  // Calculate dynamic completeness score based on actual profile fields
  const checks = [
    { label: 'Profile photo uploaded', done: Boolean(user.avatar && !user.avatar.includes('default')), weight: 15 },
    { label: 'Campus department & year set', done: Boolean(user.department && user.year), weight: 15 },
    { label: 'About introduction written', done: Boolean(user.bio && user.bio.length > 20), weight: 15, action: onEditProfile },
    { label: '3+ Skills added', done: (user.skillsOffered?.length || 0) >= 3, weight: 20, action: onAddSkill, suggestion: '+ Add 2 skills to reach 3 offered' },
    { label: '1+ Credential added', done: (user.credentials?.length || 0) >= 1, weight: 15, action: onAddCredential, suggestion: '+ Add course or certification' },
    { label: '1+ Project showcased', done: (user.projects?.length || 0) >= 1, weight: 20, action: onAddProject, suggestion: '+ Add a project to portfolio' },
  ];

  const totalScore = checks.reduce((acc, c) => acc + (c.done ? c.weight : 0), 0);
  const pendingSuggestions = checks.filter((c) => !c.done && c.suggestion);

  if (totalScore === 100) return null; // Fully complete!

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-indigo-500/10 border border-teal-500/20 dark:border-white/10 card-depth-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-outfit uppercase tracking-wider">
            Profile Strength
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400 font-mono">
            {totalScore}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            (Boost campus visibility)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 dark:bg-white/10 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 rounded-full transition-all duration-700"
          style={{ width: `${totalScore}%` }}
        />
      </div>

      {/* Actionable recommendations */}
      {pendingSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Recommended steps:
          </span>
          {pendingSuggestions.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-400 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Plus className="w-3 h-3 text-teal-500" />
              <span>{item.suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
