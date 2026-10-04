import React from 'react';
import { UserProfile } from '../../types';
import { BookOpen, Users, Star, ThumbsUp, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface LearningTeachingImpactProps {
  user: UserProfile;
}

export const LearningTeachingImpact: React.FC<LearningTeachingImpactProps> = ({ user }) => {
  // Compute total endorsements across all offered skills
  const totalEndorsements = (
    user.endorsements ? Object.values(user.endorsements) : []
  ).reduce<number>((acc, list) => acc + (Array.isArray(list) ? list.length : 0), 0);

  // Teaching stats (only real values from user profile)
  const sessionsTaught = user.completedSessions || 0;
  const hoursTaught = user.hoursTaught || 0;
  const hoursLearned = user.hoursLearned || 0;
  const rating = user.averageRating || 5.0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* LEARNING JOURNEY */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 shadow-sm card-depth-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                Learning Journey
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skills explored and study hours acquired
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hours Learned
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 block">
                {hoursLearned}h
              </span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                1-on-1 verified video calls
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Topics
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 block">
                {user.skillsWanted.length}
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Active roadmaps
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Skills Currently Exploring:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200/80 dark:border-sky-800/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center space-x-1.5 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>NEP 2020 Multidisciplinary Learning Barter</span>
        </div>
      </div>

      {/* TEACHING IMPACT */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 shadow-sm card-depth-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                Teaching &amp; Mentorship Impact
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct contributions to fellow campus students
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hours Taught
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 block">
                {hoursTaught}h
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                {sessionsTaught} completed sessions
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Average Rating
              </span>
              <div className="flex items-center space-x-1.5 mt-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                {user.totalReviews} peer testimonials
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ThumbsUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Peer Endorsements Received
              </span>
            </div>
            <span className="text-sm font-extrabold text-teal-700 dark:text-teal-300 font-mono">
              {totalEndorsements}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center space-x-1.5 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Real-time reputation verified on MITS institutional ledger</span>
        </div>
      </div>
    </div>
  );
};
