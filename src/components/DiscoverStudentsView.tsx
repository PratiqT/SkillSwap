import React, { useState } from 'react';
import { UserProfile, SwapRequest } from '../types';
import { NANO_SKILLS_LIBRARY } from '../data/skillsLibrary';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  Clock,
  ThumbsUp,
  X
} from 'lucide-react';

interface DiscoverStudentsViewProps {
  currentUser: UserProfile;
  peers: UserProfile[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewProfile: (peer: UserProfile) => void;
  onRequestSession: (peer: UserProfile) => void;
  activeRequests?: SwapRequest[];
}

export const DiscoverStudentsView: React.FC<DiscoverStudentsViewProps> = ({
  currentUser,
  peers,
  searchQuery,
  onSearchChange,
  onViewProfile,
  onRequestSession,
  activeRequests = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'all' | 'teaching' | 'learning'>('all');

  const categories = ['All', 'Tech', 'Creative Arts', 'Music', 'Fitness', 'Media'];

  // Filter peers
  const filteredPeers = peers.filter((p) => {
    // Exclude current user
    if (p.id === currentUser.id) return false;

    // Search query matching
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.headline?.toLowerCase().includes(q) ||
      p.skillsOffered.some((s) => s.toLowerCase().includes(q)) ||
      p.skillsWanted.some((s) => s.toLowerCase().includes(q)) ||
      p.department.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Branch filter
    if (selectedBranch !== 'All' && p.department !== selectedBranch) {
      return false;
    }

    // Min rating filter
    if (minRating > 0 && p.averageRating < minRating) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const catSkills = NANO_SKILLS_LIBRARY.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      ).map((s) => s.name.toLowerCase());

      const hasOffered = p.skillsOffered.some((s) =>
        catSkills.includes(s.toLowerCase())
      );
      const hasWanted = p.skillsWanted.some((s) =>
        catSkills.includes(s.toLowerCase())
      );

      if (filterMode === 'teaching' && !hasOffered) return false;
      if (filterMode === 'learning' && !hasWanted) return false;
      if (filterMode === 'all' && !hasOffered && !hasWanted) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0e2744] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-700/50 relative overflow-hidden mesh-ambient">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Discover Verified Campus Talent</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight font-outfit">
            Connect with Students at MITS Gwalior
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
            Explore peer mentors offering programming, system design, creative arts, and academic skills. Request 1-on-1 video sessions without currency exchange.
          </p>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none hidden md:block">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Search & Comprehensive Filters Bar */}
      <div className="bg-white dark:bg-[#0c1524] rounded-2xl border border-slate-200/90 dark:border-white/10 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Row 1: Search Input */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Python, AI, React, Guitar, or student name..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-[#101c30] border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department / Branch Dropdown */}
          <div className="sm:w-60">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#101c30] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Departments</option>
              {ALL_MITS_BRANCHES.slice(0, 10).map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating Dropdown */}
          <div className="sm:w-36">
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#101c30] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>★ 4.5+ Rating</option>
              <option value={4.8}>★ 4.8+ Top Rated</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Pills & Mode Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Teaching vs Learning Filter Mode */}
          <div className="flex items-center space-x-1 self-start sm:self-auto bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-[#101c30] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All Skills
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('teaching')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterMode === 'teaching'
                  ? 'bg-white dark:bg-[#101c30] text-teal-600 dark:text-teal-400 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              They Can Teach
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('learning')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterMode === 'learning'
                  ? 'bg-white dark:bg-[#101c30] text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              They Want to Learn
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Verified Students <span className="text-slate-400 font-normal">({filteredPeers.length})</span>
        </h2>
        <span className="text-xs text-slate-400">
          MITS Campus Domain
        </span>
      </div>

      {/* Students Card Grid */}
      {filteredPeers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 text-center flex flex-col items-center justify-center">
          <GraduationCap className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No students found matching filters
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Try adjusting your search query, department, or skill category.
          </p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setSelectedCategory('All');
              setSelectedBranch('All');
              setMinRating(0);
              setFilterMode('all');
            }}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-teal-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPeers.map((peer) => {
            const branchObj = ALL_MITS_BRANCHES.find((b) => b.value === peer.department);
            const branchCode = branchObj ? branchObj.code : peer.department;

            // Check if active request already exists
            const existingReq = activeRequests.find(
              (r) =>
                (r.fromUserId === currentUser.id && r.toUserId === peer.id) ||
                (r.toUserId === currentUser.id && r.fromUserId === peer.id)
            );

            return (
              <div
                key={peer.id}
                className="rounded-3xl bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 overflow-hidden card-depth flex flex-col justify-between"
              >
                <div>
                  {/* Subtle top banner strip */}
                  <div
                    className="h-16 w-full relative mesh-ambient"
                    style={{
                      background: peer.coverImage || 'linear-gradient(135deg, #091a2f 0%, #0d2847 100%)',
                    }}
                  />

                  {/* Header info */}
                  <div className="px-5 pt-0 pb-4 relative">
                    <div className="flex items-end justify-between -mt-9 mb-3">
                      <div
                        className="relative cursor-pointer group"
                        onClick={() => onViewProfile(peer)}
                      >
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-[#0c1524] shadow-md group-hover:scale-105 transition-transform"
                        />
                        {peer.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-teal-500 text-white rounded-full p-1 border border-white dark:border-[#0c1524]">
                            <CheckCircle2 className="w-3 h-3 fill-white text-teal-600" />
                          </div>
                        )}
                      </div>

                      {/* Rating Pill */}
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{peer.averageRating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">({peer.completedSessions} sessions)</span>
                      </div>
                    </div>

                    {/* Name & Academic info */}
                    <div
                      className="cursor-pointer"
                      onClick={() => onViewProfile(peer)}
                    >
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight hover:text-teal-500 transition-colors">
                        {peer.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                        {peer.headline || `${branchCode} • ${peer.year}`}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {branchCode} • {peer.college}
                      </p>
                    </div>

                    {/* Bio snippet */}
                    {peer.bio && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                        {peer.bio}
                      </p>
                    )}

                    {/* Teaching Skills */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Can Teach:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {peer.skillsOffered.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-500/20"
                          >
                            {s}
                          </span>
                        ))}
                        {peer.skillsOffered.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-bold self-center">
                            +{peer.skillsOffered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Learning Skills */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Learning:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {peer.skillsWanted.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile(peer)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    View Identity
                  </button>

                  <button
                    type="button"
                    onClick={() => onRequestSession(peer)}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1 active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Request Session</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
