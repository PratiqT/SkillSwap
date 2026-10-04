import React, { useState } from 'react';
import { Achievement } from '../../types';
import { Trophy, Plus, Calendar, X, Sparkles } from 'lucide-react';

interface AchievementsTimelineProps {
  achievements?: Achievement[];
  isCurrentUser: boolean;
  onAddAchievement?: (ach: Achievement) => void;
}

export const AchievementsTimeline: React.FC<AchievementsTimelineProps> = ({
  achievements = [],
  isCurrentUser,
  onAddAchievement,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState('2026');
  const [badgeIcon, setBadgeIcon] = useState('🏆');
  const [description, setDescription] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    onAddAchievement?.({
      id: `ach-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      year: year.trim() || '2026',
      badgeIcon: badgeIcon || '🏆',
      description: description.trim() || undefined,
    });

    setTitle('');
    setOrganization('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Honors &amp; Campus Achievements
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified campus hackathons, technical competitions, and academic honors
            </p>
          </div>
        </div>

        {isCurrentUser && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Honor</span>
          </button>
        )}
      </div>

      {achievements.length === 0 ? (
        <div className="py-8 px-6 rounded-2xl bg-slate-50/60 dark:bg-[#101c30]/50 border border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center">
          <Trophy className="w-8 h-8 text-amber-400 mb-2 opacity-60" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No milestones recorded yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-0.5 mb-3">
            Add your campus hackathons, paper presentations, and contest standings.
          </p>
          {isCurrentUser && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              + Add Milestone
            </button>
          )}
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
          {achievements.map((ach) => (
            <div key={ach.id} className="relative group">
              {/* Timeline Node Marker */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-white dark:bg-[#0c1524] border-2 border-amber-400 flex items-center justify-center text-xs shadow-xs group-hover:scale-125 transition-transform">
                <span className="text-[10px]">{ach.badgeIcon || '🏆'}</span>
              </div>

              {/* Achievement Content Card */}
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 card-depth-subtle">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {ach.title}
                  </h3>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{ach.year}</span>
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {ach.organization}
                </p>

                {ach.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                    {ach.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Add Achievement Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#0c1524] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mb-1">
              Add Campus Achievement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Document your competition wins and campus recognition milestones.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart India Hackathon Finalist"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-amber-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. MITS Gwalior / AICTE"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-amber-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-amber-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Icon (Emoji)
                </label>
                <div className="flex space-x-2">
                  {['🏆', '🎓', '🚀', '🥇', '🌟', '💻'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setBadgeIcon(ic)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm cursor-pointer transition-all ${
                        badgeIcon === ic
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Detail (optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key highlight or outcome of this achievement..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-amber-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
