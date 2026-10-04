import React from 'react';
import { UserProfile } from '../../types';
import { User, Target, BookOpen, Lightbulb, Edit3 } from 'lucide-react';

interface AboutCardProps {
  user: UserProfile;
  isCurrentUser: boolean;
  onEdit?: () => void;
}

export const AboutCard: React.FC<AboutCardProps> = ({ user, isCurrentUser, onEdit }) => {
  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all card-depth-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
            About
          </h2>
        </div>
        {isCurrentUser && (
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Edit About"
            aria-label="Edit About"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Bio */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-5">
        {user.bio || 'Passionate student participating in peer learning and technical skill barter at MITS Gwalior.'}
      </p>

      {/* Structured Campus Summary Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-start space-x-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-100 dark:border-white/5">
          <Target className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Learning Focus
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user.skillsWanted.length > 0 ? user.skillsWanted.join(', ') : 'Open to exploring new tech & campus skills'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-100 dark:border-white/5">
          <BookOpen className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Mentorship Areas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user.skillsOffered.length > 0 ? user.skillsOffered.join(', ') : 'Hands-on practical code & problem-solving'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
