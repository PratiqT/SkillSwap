import React from 'react';
import { UserProfile, SwapRequest, ActivityEvent } from '../types';
import { NANO_SKILLS_LIBRARY } from '../data/skillsLibrary';
import { ProfileCompletionCard } from './profile/ProfileCompletionCard';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Flame,
  Zap,
  ArrowRightLeft,
  Video
} from 'lucide-react';

interface FeedViewProps {
  currentUser: UserProfile;
  peers: UserProfile[];
  swapRequests: SwapRequest[];
  onNavigateTab: (tab: 'feed' | 'discover' | 'profile' | 'coordinator') => void;
  onViewPeerProfile: (peer: UserProfile) => void;
  onRequestSession: (peer: UserProfile) => void;
  onOpenRequestsDrawer: () => void;
  onOpenEditProfile: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  peers,
  swapRequests,
  onNavigateTab,
  onViewPeerProfile,
  onRequestSession,
  onOpenRequestsDrawer,
  onOpenEditProfile,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Complementary suggested peers: Peers who offer what current user wants, or want what current user offers
  const suggestedPeers = peers
    .filter((p) => p.id !== currentUser.id)
    .map((peer) => {
      // Calculate match score
      const teachMatch = peer.skillsOffered.filter((s) =>
        currentUser.skillsWanted.some((w) => w.toLowerCase() === s.toLowerCase())
      );
      const learnMatch = peer.skillsWanted.filter((s) =>
        currentUser.skillsOffered.some((o) => o.toLowerCase() === s.toLowerCase())
      );
      const score = teachMatch.length * 2 + learnMatch.length;
      return { peer, score, teachMatch, learnMatch };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // Aggregate authentic campus activity events across all peers
  const allEvents: ActivityEvent[] = [];
  peers.forEach((p) => {
    if (p.activityEvents) {
      allEvents.push(...p.activityEvents);
    }
  });
  // Sort latest first
  const displayEvents = allEvents.slice(0, 6);

  // Trending skills from nano library
  const trendingSkills = NANO_SKILLS_LIBRARY.filter((s) => s.demandStatus === 'Highly Demanded' || s.demandStatus === 'Trending').slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
      {/* ========================================================
          LEFT COLUMN: Professional Identity Mini-Card & Shortcuts
          ======================================================== */}
      <aside className="lg:col-span-3 space-y-5">
        {/* Profile Card */}
        <div className="rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 overflow-hidden card-depth-subtle shadow-xs">
          {/* Subtle cover */}
          <div
            className="h-16 w-full relative mesh-ambient"
            style={{
              background: currentUser.coverImage || 'linear-gradient(135deg, #091a2f 0%, #0d2847 100%)',
            }}
          />

          <div className="px-5 pb-5 pt-0 relative text-center">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full overflow-hidden avatar-ring-3d mx-auto -mt-8 mb-2.5 bg-slate-900 border-2 border-white dark:border-[#0c1524] cursor-pointer"
              onClick={() => onNavigateTab('profile')}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <h3
              className="text-base font-extrabold text-slate-900 dark:text-white font-outfit hover:text-teal-500 transition-colors cursor-pointer"
              onClick={() => onNavigateTab('profile')}
            >
              {currentUser.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
              {currentUser.headline || `${currentUser.department} • ${currentUser.year}`}
            </p>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">
              {currentUser.college}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-center">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                  {currentUser.completedSessions}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">
                  Sessions
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                  {currentUser.hoursLearned}h
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">
                  Learned
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                  {currentUser.averageRating.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">
                  Rating
                </span>
              </div>
            </div>

            {/* View Full Identity Button */}
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="w-full mt-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              View Full Profile
            </button>
          </div>
        </div>

        {/* Quick Navigation Box */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 space-y-2 card-depth-subtle shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Campus Shortcuts
          </span>

          <button
            type="button"
            onClick={() => onNavigateTab('discover')}
            className="w-full py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-500" />
              <span>Discover Students</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onOpenRequestsDrawer}
            className="w-full py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-sky-500" />
              <span>My Active Swaps</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-mono font-bold">
              {swapRequests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenEditProfile}
            className="w-full py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Update Teaching Skills</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* ========================================================
          CENTER COLUMN: Main Feed (Greeting, Suggestions, Events)
          ======================================================== */}
      <main className="lg:col-span-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0c1f36] text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-700/50 relative overflow-hidden mesh-ambient">
          <div className="relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Campus Skill Barter</span>
            </span>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-outfit">
              {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-normal">
              Continue building your professional skill identity for campus. Swap knowledge 1-on-1 with verified MITS peers.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => onNavigateTab('discover')}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
              >
                <span>Find Peer Mentors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onOpenEditProfile}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
              >
                + Offer New Skill
              </button>
            </div>
          </div>
        </div>

        {/* Profile Strength Widget */}
        <ProfileCompletionCard
          user={currentUser}
          onEditProfile={onOpenEditProfile}
          onAddSkill={onOpenEditProfile}
          onAddCredential={() => onNavigateTab('profile')}
          onAddProject={() => onNavigateTab('profile')}
        />

        {/* Suggested Peer Matches for Current User */}
        <section className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 shadow-sm space-y-4 card-depth-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit">
                  Suggested Peer Exchanges
                </h2>
                <p className="text-[11px] text-slate-400">
                  Students teaching skills you want to learn
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('discover')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-0.5 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {suggestedPeers.map(({ peer, teachMatch }) => (
              <div
                key={peer.id}
                className="p-4 rounded-2xl bg-slate-50/90 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 flex flex-col justify-between card-depth-subtle"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2.5">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 cursor-pointer"
                      onClick={() => onViewPeerProfile(peer)}
                    />
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-teal-500"
                        onClick={() => onViewPeerProfile(peer)}
                      >
                        {peer.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {peer.department}
                      </p>
                    </div>
                  </div>

                  {teachMatch.length > 0 ? (
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                        Teaches your target:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {teachMatch.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 text-[10px] font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
                      Offers: {peer.skillsOffered.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>

                <div className="pt-2.5 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{peer.averageRating.toFixed(1)}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onRequestSession(peer)}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    Request Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real Campus Activity Feed */}
        <section className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 shadow-sm space-y-4 card-depth-subtle">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit">
                Recent Campus Activity
              </h2>
              <p className="text-[11px] text-slate-400">
                Verified exchanges and milestones happening across MITS
              </p>
            </div>
          </div>

          {displayEvents.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              <Calendar className="w-6 h-6 mx-auto mb-1 text-slate-300" />
              <span>Campus activity will appear as sessions complete.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {displayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 flex items-start space-x-3 card-depth-subtle"
                >
                  <img
                    src={evt.userAvatar}
                    alt={evt.userName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {evt.userName}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {evt.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-normal">
                      {evt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ========================================================
          RIGHT COLUMN: Trending Campus Skills & Badges
          ======================================================== */}
      <aside className="lg:col-span-3 space-y-5">
        {/* Trending Skills Box */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 card-depth-subtle shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Trending Campus Skills
            </h3>
          </div>

          <div className="space-y-2">
            {trendingSkills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => onNavigateTab('discover')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 hover:border-teal-400/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-500 transition-colors block">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {skill.category} • {skill.learnDifficulty}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                  ★ {skill.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Recognition & NEP Pillar */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-indigo-500/10 border border-teal-500/20 card-depth-subtle shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              NEP 2020 Aligned
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            SkillSwap enables holistic, multidisciplinary peer mentoring for engineering &amp; technology students at MITS Gwalior.
          </p>
        </div>
      </aside>
    </div>
  );
};
