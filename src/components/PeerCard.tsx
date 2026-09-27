import React from 'react';
import { UserProfile, LearningSession } from '../types';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import { getBadgeById } from '../services/badgeService';
import {
  Star, CheckCircle2, ArrowRightLeft, MessageCircle, Video,
  Clock, BookOpen, Award, Check, X
} from 'lucide-react';

interface PeerCardProps {
  peer: UserProfile;
  currentUserId: string;
  activeSession?: LearningSession;
  activeRequest?: LearningSession;
  onViewProfile?: (peer: UserProfile) => void;
  onViewReviews?: (peer: UserProfile) => void;
  onRequestSession?: (peer: UserProfile) => void;
  onInitiateSwap?: (peer: UserProfile) => void;
  onOpenChat?: (session: any) => void;
  onStartVideo?: (session: any) => void;
  onAcceptSession?: (sessionId: string) => void;
  onAcceptRequest?: (requestId: string) => void;
  onDeclineSession?: (sessionId: string) => void;
  onDeclineRequest?: (requestId: string) => void;
}

export const PeerCard: React.FC<PeerCardProps> = ({
  peer,
  currentUserId,
  activeSession,
  activeRequest,
  onViewProfile,
  onViewReviews,
  onRequestSession,
  onInitiateSwap,
  onOpenChat,
  onStartVideo,
  onAcceptSession,
  onAcceptRequest,
  onDeclineSession,
  onDeclineRequest,
}) => {
  const session = activeSession || activeRequest;
  const handleView = onViewProfile || onViewReviews || (() => {});
  const handleRequest = onRequestSession || onInitiateSwap || (() => {});
  const handleAccept = onAcceptSession || onAcceptRequest || (() => {});
  const handleDecline = onDeclineSession || onDeclineRequest || (() => {});

  const branchCode = ALL_MITS_BRANCHES.find((b) => b.value === peer.department)?.code || peer.department;

  const isIncomingRequest = session && ((session.status === 'requested' || (session.status as any) === 'pending') && (session.trainerId === currentUserId || session.toUserId === currentUserId));
  const isOutgoingRequest = session && ((session.status === 'requested' || (session.status as any) === 'pending') && (session.traineeId === currentUserId || session.fromUserId === currentUserId));
  const isConnected = session && (session.status === 'accepted' || session.status === 'active');

  return (
    <div className="bg-white dark:bg-[#0D1B2A] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:shadow-lg dark:hover:shadow-black/50 hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="relative shrink-0 cursor-pointer" onClick={() => handleView(peer)}>
            <img
              src={peer.avatar}
              alt={peer.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-sky-400 dark:group-hover:ring-teal-400 transition-all"
            />
            {peer.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-[#0D1B2A] rounded-full p-0.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-teal-400 fill-sky-500 dark:fill-teal-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onViewProfile(peer)}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-teal-400 transition-colors">{peer.name}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{branchCode} • {peer.year}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                {peer.averageRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{peer.completedSessions} sessions</span>
            </div>
          </div>
          {/* Badges preview */}
          {peer.badges.length > 0 && (
            <div className="flex -space-x-1">
              {peer.badges.slice(0, 3).map((b) => {
                const def = getBadgeById(b.badgeId);
                return def ? (
                  <span key={b.badgeId} className="text-sm" title={def.name}>{def.icon}</span>
                ) : null;
              })}
              {peer.badges.length > 3 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-1">+{peer.badges.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="px-4 pb-3 space-y-2">
        <div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Can Teach</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {peer.skillsOffered.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full border border-sky-200/80 dark:border-sky-800/60">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wants to Learn</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {peer.skillsWanted.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-200/80 dark:border-teal-800/60">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="px-4 pb-4 pt-1">
        {isIncomingRequest && session ? (
          <div className="space-y-2">
            <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/60 text-center">
              📩 Wants to learn <strong>{session.skill || session.skillWanted}</strong> from you
            </p>
            <div className="flex space-x-2">
              <button type="button" onClick={() => handleAccept(session.id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1">
                <Check className="w-3.5 h-3.5" /><span>Accept</span>
              </button>
              <button type="button" onClick={() => handleDecline(session.id)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1">
                <X className="w-3.5 h-3.5" /><span>Decline</span>
              </button>
            </div>
          </div>
        ) : isOutgoingRequest ? (
          <div className="py-2 text-center text-[11px] text-sky-600 dark:text-sky-300 font-bold bg-sky-50 dark:bg-sky-950/40 rounded-lg border border-sky-200 dark:border-sky-800/60">
            ⏳ Session Request Sent
          </div>
        ) : isConnected && session ? (
          <div className="space-y-2">
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-center">
              ✅ Connected — Session #{session.sessionNumber || 1}: {session.skill || session.skillWanted}
            </p>
            <div className="flex space-x-2">
              <button type="button" onClick={() => onOpenChat?.(session)}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1">
                <MessageCircle className="w-3.5 h-3.5" /><span>Chat</span>
              </button>
              <button type="button" onClick={() => onStartVideo?.(session)}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1">
                <Video className="w-3.5 h-3.5" /><span>Video</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleRequest(peer)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1.5 focus:ring-2 focus:ring-teal-400 focus:outline-hidden"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Request Learning Session</span>
          </button>
        )}
      </div>
    </div>
  );
};
