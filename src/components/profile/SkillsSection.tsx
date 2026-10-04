import React from 'react';
import { UserProfile } from '../../types';
import { Sparkles, Plus, ThumbsUp, Check, Layers, ArrowUpRight } from 'lucide-react';

interface SkillsSectionProps {
  user: UserProfile;
  currentUserId?: string;
  isCurrentUser: boolean;
  onAddSkill?: () => void;
  onEndorseSkill?: (skillName: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  user,
  currentUserId,
  isCurrentUser,
  onAddSkill,
  onEndorseSkill,
}) => {
  const getProficiency = (skill: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    return user.skillProficiencies?.[skill] || 'Intermediate';
  };

  const getProficiencyBar = (level: string) => {
    switch (level) {
      case 'Advanced':
        return { percent: 'w-4/5', color: 'bg-teal-500', label: 'Advanced' };
      case 'Intermediate':
        return { percent: 'w-3/5', color: 'bg-sky-500', label: 'Intermediate' };
      case 'Beginner':
      default:
        return { percent: 'w-2/5', color: 'bg-indigo-400', label: 'Beginner' };
    }
  };

  const getEndorsementCount = (skill: string): number => {
    const list = user.endorsements?.[skill];
    return list ? list.length : 0;
  };

  const hasEndorsed = (skill: string): boolean => {
    if (!currentUserId) return false;
    return !!user.endorsements?.[skill]?.includes(currentUserId);
  };

  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Skills &amp; Campus Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified through 1-on-1 peer exchanges and legitimate campus endorsements
            </p>
          </div>
        </div>

        {isCurrentUser && (
          <button
            type="button"
            onClick={onAddSkill}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        )}
      </div>

      {/* SECTION 1: WHAT I CAN TEACH */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>What I Can Teach</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {user.skillsOffered.length} skills verified for mentorship
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {user.skillsOffered.map((skill) => {
            const prof = getProficiency(skill);
            const bar = getProficiencyBar(prof);
            const endorsements = getEndorsementCount(skill);
            const userEndorsed = hasEndorsed(skill);

            return (
              <div
                key={skill}
                className="group p-4 rounded-2xl bg-slate-50/90 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 card-depth relative overflow-hidden"
              >
                {/* Subtle highlight accent top border on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {skill}
                    </h3>
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                      {bar.label}
                    </span>
                  </div>

                  {/* Endorsement CTA (Only for peers viewing, or stats pill for user) */}
                  {!isCurrentUser && onEndorseSkill ? (
                    <button
                      type="button"
                      onClick={() => onEndorseSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                        userEndorsed
                          ? 'bg-teal-500 text-white shadow-2xs'
                          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 border border-slate-200 dark:border-white/10'
                      }`}
                      title={userEndorsed ? 'You endorsed this skill' : 'Endorse this peer skill'}
                    >
                      {userEndorsed ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Endorsed ({endorsements})</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-3 h-3" />
                          <span>Endorse ({endorsements})</span>
                        </>
                      )}
                    </button>
                  ) : (
                    endorsements > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/20">
                        {endorsements} {endorsements === 1 ? 'endorsement' : 'endorsements'}
                      </span>
                    )
                  )}
                </div>

                {/* Proficiency Bar */}
                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${bar.color} ${bar.percent} rounded-full transition-all duration-500`} />
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>Available for 1-on-1 swap</span>
                  <span>MITS Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: WHAT I'M LEARNING */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>What I'm Learning (Looking for Mentors)</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {user.skillsWanted.length} target skills
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {user.skillsWanted.map((skill) => (
            <div
              key={skill}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/70 dark:border-white/5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2 card-depth-subtle"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>{skill}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                Seeking Peer
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
