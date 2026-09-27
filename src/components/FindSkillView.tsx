import React, { useState } from 'react';
import { UserProfile, LearningSession } from '../types';
import { NANO_SKILLS_LIBRARY } from '../data/skillsLibrary';
import { PeerCard } from './PeerCard';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import { Search, GraduationCap, ArrowLeft } from 'lucide-react';

interface FindSkillViewProps {
  currentUser: UserProfile;
  peers: UserProfile[];
  sessions: LearningSession[];
  onViewPeerProfile: (peer: UserProfile) => void;
  onRequestSession: (peer: UserProfile) => void;
  onOpenChat: (session: LearningSession) => void;
  onStartVideo: (session: LearningSession) => void;
  onAcceptSession: (sessionId: string) => void;
  onDeclineSession: (sessionId: string) => void;
  onBack: () => void;
}

export const FindSkillView: React.FC<FindSkillViewProps> = ({
  currentUser,
  peers,
  sessions,
  onViewPeerProfile,
  onRequestSession,
  onOpenChat,
  onStartVideo,
  onAcceptSession,
  onDeclineSession,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPeers = peers.filter((p) => {
    if (p.id === currentUser.id) return false;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skillsOffered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.skillsWanted.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const categorySkills = NANO_SKILLS_LIBRARY.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      ).map((s) => s.name.toLowerCase());
      matchesCategory = p.skillsOffered.some((skill) =>
        categorySkills.includes(skill.toLowerCase())
      );
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-outfit">Find a Skill</h2>
          <p className="text-xs text-slate-500">Browse verified peer mentors at {currentUser.college}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, skill (e.g. 'DSA', 'Python', 'Guitar')..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-sky-500 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Tech', 'Creative Arts', 'Music', 'Fitness', 'Media', 'Academics'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Peer Grid */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Available Mentors <span className="text-slate-400 font-normal">({filteredPeers.length})</span>
        </h3>
      </div>

      {filteredPeers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center">
          <GraduationCap className="w-10 h-10 text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No matches found</h3>
          <p className="text-xs text-slate-400 mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPeers.map((peer) => {
            const peerSession = sessions.find(
              (s) =>
                ((s.traineeId === currentUser.id && s.trainerId === peer.id) ||
                  (s.trainerId === currentUser.id && s.traineeId === peer.id)) &&
                s.status !== 'completed' && s.status !== 'cancelled'
            );
            return (
              <PeerCard
                key={peer.id}
                peer={peer}
                currentUserId={currentUser.id}
                activeSession={peerSession}
                onViewProfile={(p) => onViewPeerProfile(p)}
                onRequestSession={(p) => onRequestSession(p)}
                onOpenChat={(s) => onOpenChat(s)}
                onStartVideo={(s) => onStartVideo(s)}
                onAcceptSession={onAcceptSession}
                onDeclineSession={onDeclineSession}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
