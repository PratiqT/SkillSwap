import React, { useState } from 'react';
import { UserProfile, BadgeDefinition } from '../../types';
import { BADGE_DEFINITIONS } from '../../services/badgeService';
import { Award, Lock, CheckCircle2, Sparkles, X } from 'lucide-react';

interface BadgesShowcaseProps {
  user: UserProfile;
}

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ user }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  const earnedMap = new Map<string, string>();
  user.badges.forEach((b) => earnedMap.set(b.badgeId, b.earnedAt));

  const earnedCount = user.badges.length;

  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
              SkillSwap Badge Collection
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dimensional milestone badges earned through authenticated campus sessions
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-extrabold border border-violet-500/20 font-mono">
          {earnedCount} / {BADGE_DEFINITIONS.length} Unlocked
        </span>
      </div>

      {/* 3D Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earnedMap.has(badge.id);
          const earnedDate = earnedMap.get(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`badge-3d p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer select-none min-h-[110px] ${
                isEarned
                  ? 'bg-gradient-to-b from-slate-50 to-white dark:from-[#111d33] dark:to-[#0c1524] border-violet-500/30 dark:border-violet-400/30 shadow-xs hover:border-violet-500 dark:hover:border-violet-400'
                  : 'bg-slate-50/50 dark:bg-[#101c30]/40 border-slate-200/50 dark:border-white/5 opacity-40 hover:opacity-75 grayscale'
              }`}
            >
              {/* Badge Icon */}
              <div className="relative my-1">
                <span className="text-3xl filter drop-shadow-sm transition-transform duration-300 block">
                  {badge.icon}
                </span>
                {isEarned && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0c1524] flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Name & Tier */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {badge.name}
                </h4>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5 capitalize">
                  {badge.tier}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Badge Detail */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-[#0c1524] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-500/10 flex items-center justify-center text-4xl mb-4 border border-violet-500/20 shadow-md">
              {selectedBadge.icon}
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              {selectedBadge.tier} Tier • {selectedBadge.hindiName}
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
              {selectedBadge.name}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 text-left text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                How to Unlock:
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {selectedBadge.requirement}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
              {earnedMap.has(selectedBadge.id) ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Unlocked on {earnedMap.get(selectedBadge.id)}</span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-400 flex items-center justify-center space-x-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Incomplete • Continue learning to earn</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
