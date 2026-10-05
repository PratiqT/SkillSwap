import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ALL_MITS_BRANCHES } from '../../data/mitsBranches';
import { ReportButton } from '../ReportButton';
import {
  CheckCircle2,
  Share2,
  Edit3,
  BookOpen,
  Award,
  Star,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  MessageCircle,
  Video
} from 'lucide-react';

interface ProfileHeaderProps {
  user: UserProfile;
  isCurrentUser: boolean;
  currentUser?: UserProfile;
  onEditProfile?: () => void;
  onRequestSession?: () => void;
  onOpenChat?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser,
  currentUser,
  onEditProfile,
  onRequestSession,
  onOpenChat,
}) => {
  const [copied, setCopied] = useState(false);

  const branchObj = ALL_MITS_BRANCHES.find((b) => b.value === user.department);
  const branchDisplay = branchObj ? branchObj.label : user.department;
  const branchCode = branchObj ? branchObj.code : user.department;

  const totalSkills = (user.skillsOffered?.length || 0) + (user.skillsWanted?.length || 0);
  const totalCredentials = user.credentials?.length || 0;
  const headlineText = user.headline || `${user.skillsOffered.slice(0, 3).join(' • ')} Developer`;

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/u/${user.username || user.id}`;
    const shareData = {
      title: `${user.name} | SkillSwap Student Identity`,
      text: `Connect with ${user.name} (${user.year}, ${branchCode} @ ${user.college}) on SkillSwap to barter skills 1-on-1!`,
      url: profileUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback prompt
      window.prompt('Copy profile link:', profileUrl);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#0c1524] border border-slate-200/90 dark:border-white/10 shadow-sm transition-all duration-300">
      {/* Cover / Ambient Background */}
      <div
        className="h-44 sm:h-56 w-full relative overflow-hidden mesh-ambient"
        style={{
          background: user.coverImage || 'linear-gradient(135deg, #091a2f 0%, #0d2847 45%, #0f3c5c 100%)',
        }}
      >
        {/* Subtle geometric light orbs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-32 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Institution Badge in Cover */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white text-xs font-semibold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Institution Verified:</span>
          <span className="text-teal-300 font-bold">{user.college}</span>
        </div>
      </div>

      {/* Profile Info Area */}
      <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-5">
          {/* Avatar with subtle 3D Ring */}
          <div className="relative group self-start">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden avatar-ring-3d bg-slate-900 border-4 border-white dark:border-[#0c1524] relative shadow-xl">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {user.verified && (
              <div
                className="absolute bottom-1 right-1 bg-teal-500 text-white rounded-full p-1.5 shadow-md border-2 border-white dark:border-[#0c1524]"
                title="Verified Student Identity"
              >
                <CheckCircle2 className="w-4 h-4 fill-white text-teal-600" />
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5 sm:self-end">
            {isCurrentUser ? (
              <>
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 text-white text-xs font-bold flex items-center space-x-2 border border-transparent dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
                </button>
              </>
            ) : (
              <>
                {onOpenChat && (
                  <button
                    type="button"
                    onClick={onOpenChat}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center space-x-2 border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
                    <span>Message</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onRequestSession}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Request Session</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Share Profile"
                  aria-label="Share Profile"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                {currentUser && (
                  <ReportButton
                    reporterId={currentUser.id}
                    reportedUserId={user.id}
                    reportedUserName={user.name}
                    contentType="profile"
                    contentPreview={`Student Profile: ${user.name} (@${user.username || user.id}) - ${user.headline || user.bio || ''}`}
                    compact
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Name & Academic Details */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight">
              {user.name}
            </h1>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              @{user.username || user.id.replace('mits-', '')}
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-teal-500" />
              <span>{user.verificationBadge || 'Verified Student'}</span>
            </span>
          </div>

          {/* Academic Headline */}
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {headlineText}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {user.year} • {branchDisplay} • <span className="text-slate-700 dark:text-slate-300 font-semibold">{user.college}</span>
          </p>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 flex items-center space-x-3 card-depth-subtle">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                {totalSkills}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Active Skills
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 flex items-center space-x-3 card-depth-subtle">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                {totalCredentials}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Credentials
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 flex items-center space-x-3 card-depth-subtle">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                {user.completedSessions}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Sessions Done
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 flex items-center space-x-3 card-depth-subtle">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                {user.averageRating.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">
                Peer Rating ({user.totalReviews})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
