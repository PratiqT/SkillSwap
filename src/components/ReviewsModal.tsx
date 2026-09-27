import React, { useState } from 'react';
import { UserProfile, LearningSession, PeerReview } from '../types';
import { getBadgeById, BADGE_DEFINITIONS } from '../services/badgeService';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import {
  X, Star, CheckCircle2, BookOpen, Clock, Award,
  ArrowRightLeft, MessageCircle, Shield
} from 'lucide-react';

interface PeerProfileModalProps {
  peer: UserProfile;
  currentUser?: UserProfile;
  currentUserId?: string;
  sessions?: LearningSession[];
  onAddReview?: (peerId: string, review: { rating: number; comment: string; skillLearned: string }) => void;
  onRequestSession?: () => void;
  onInitiateSwap?: (peer: UserProfile) => void;
  onClose: () => void;
}

export const ReviewsModal: React.FC<PeerProfileModalProps> = ({
  peer,
  currentUser,
  currentUserId,
  sessions = [],
  onAddReview,
  onRequestSession,
  onInitiateSwap,
  onClose,
}) => {
  const [tab, setTab] = useState<'profile' | 'reviews' | 'badges'>('profile');
  const branchCode = ALL_MITS_BRANCHES.find((b) => b.value === peer.department)?.code || peer.department;
  const activeUserId = currentUserId || currentUser?.id || '';

  const handleRequest = () => {
    if (onRequestSession) onRequestSession();
    else if (onInitiateSwap) onInitiateSwap(peer);
  };

  const peerSessions = (sessions || []).filter(
    (s) => (s.trainerId === peer.id || s.traineeId === peer.id) && s.status === 'completed'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header with profile info */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 dark:from-[#07111F] dark:via-[#0D1B2A] dark:to-[#122337] text-white relative">
          <button type="button" onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-16 h-16 rounded-full object-cover ring-2 ring-white/30" />
              {peer.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0D1B2A] rounded-full p-0.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-teal-400 fill-sky-500 dark:fill-teal-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit">{peer.name}</h2>
              <p className="text-xs text-slate-300">{branchCode} • {peer.year} • {peer.college}</p>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-semibold">{peer.verificationBadge}</span>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Sessions', value: peer.completedSessions, icon: BookOpen },
              { label: 'Teaching', value: `${peer.hoursTaught}h`, icon: Clock },
              { label: 'Learning', value: `${peer.hoursLearned}h`, icon: BookOpen },
              { label: 'Rating', value: peer.averageRating.toFixed(1), icon: Star },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-lg p-2 text-center">
                <span className="text-sm font-bold font-mono">{s.value}</span>
                <span className="text-[10px] text-slate-300 block">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10">
          {(['profile', 'reviews', 'badges'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold capitalize cursor-pointer transition-colors ${tab === t ? 'text-sky-600 dark:text-teal-400 border-b-2 border-sky-600 dark:border-teal-400' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}>
              {t} {t === 'reviews' && `(${peer.reviews.length})`} {t === 'badges' && `(${peer.badges.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {tab === 'profile' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-700 dark:text-slate-300">{peer.bio}</p>
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Skills Offered</h4>
                <div className="flex flex-wrap gap-1.5">
                  {peer.skillsOffered.map((s) => (
                    <span key={s} className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800/60">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Wants to Learn</h4>
                <div className="flex flex-wrap gap-1.5">
                  {peer.skillsWanted.map((s) => (
                    <span key={s} className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800/60">{s}</span>
                  ))}
                </div>
              </div>
              {/* Role switching note */}
              <div className="flex items-center space-x-2 p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200/60 dark:border-sky-800/50 text-xs text-sky-800 dark:text-sky-300">
                <ArrowRightLeft className="w-4 h-4 text-sky-600 dark:text-teal-400 shrink-0" />
                <p><strong>Learner ↔ Mentor:</strong> Every student can be both a learner and a mentor. Roles are determined by each session.</p>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {peer.reviews.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No reviews yet. Reviews can only be submitted after completed sessions.</p>
              ) : (
                peer.reviews.map((review) => (
                  <div key={review.id} className="p-3 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#122337]/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <img src={review.reviewerAvatar} alt={review.reviewerName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{review.reviewerName}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Learned: {review.skillLearned}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">"{review.comment}"</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{review.date}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'badges' && (
            <div className="grid grid-cols-2 gap-2">
              {BADGE_DEFINITIONS.map((badge) => {
                const earned = (peer.badges || []).find((b) => b.badgeId === badge.id);
                return (
                  <div key={badge.id} className={`p-3 rounded-xl text-center transition-all ${earned ? `${badge.bgColor} border ${badge.borderColor}` : 'bg-slate-50 dark:bg-[#122337] border border-slate-200 dark:border-white/10 opacity-40 grayscale'
                    }`}>
                    <span className="text-2xl block mb-1">{badge.icon}</span>
                    <span className={`text-[11px] font-bold block ${earned ? badge.color : 'text-slate-500 dark:text-slate-400'}`}>{badge.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{badge.hindiName}</span>
                    {earned && <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">{earned.earnedAt}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        {peer.id !== activeUserId && (
          <div className="p-4 border-t border-slate-100 dark:border-white/10">
            <button type="button" onClick={handleRequest}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5 focus:ring-2 focus:ring-teal-400">
              <BookOpen className="w-4 h-4" />
              <span>Request Learning Session</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
