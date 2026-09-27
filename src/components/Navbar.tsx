import React from 'react';
import { UserProfile, AppNotification } from '../types';
import { SkillSwapLogo } from './SkillSwapLogo';
import { ThemeToggle } from './ThemeToggle';
import {
  Bell, CheckCircle2, Star, BookOpen,
  Clock, ArrowRightLeft, Shield, Award
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  notifications?: AppNotification[];
  pendingRequestsCount?: number;
  onOpenRequests?: () => void;
  onOpenEditProfile?: () => void;
  onToggleNotifications?: () => void;
  onEditProfile?: () => void;
  onSwitchPeer: () => void;
  onCoordinatorView?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  notifications = [],
  pendingRequestsCount = 0,
  onOpenRequests,
  onOpenEditProfile,
  onToggleNotifications,
  onEditProfile,
  onSwitchPeer,
  onCoordinatorView,
}) => {
  const unreadCount = (notifications ? notifications.filter((n) => !n.read).length : 0) + pendingRequestsCount;
  const handleEdit = onEditProfile || onOpenEditProfile || (() => {});
  const handleNotifs = onToggleNotifications || onOpenRequests || (() => {});

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="w-full bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs dark:shadow-black/30 px-4 py-2 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
        <SkillSwapLogo size="sm" />

        <div className="hidden sm:flex items-center space-x-3">
          {/* Stats Pills */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{currentUser.completedSessions} Sessions</span>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{currentUser.hoursLearned}h Learned</span>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{currentUser.hoursTaught}h Taught</span>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-[10px] font-bold">{currentUser.averageRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Coordinator Demo Access */}
          <button
            type="button"
            onClick={onCoordinatorView}
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            title="Coordinator Demo"
            aria-label="Coordinator Demo"
          >
            <Shield className="w-4.5 h-4.5" />
          </button>

          {/* Notifications / Requests */}
          <button
            type="button"
            onClick={handleNotifs}
            className="relative p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            title="Notifications & Requests"
            aria-label="Notifications & Requests"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-ring">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div 
            className="flex items-center space-x-1.5 px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer" 
            onClick={handleEdit}
            role="button"
            tabIndex={0}
            aria-label="Edit Profile"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEdit(); }}
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-sky-500/30 dark:ring-sky-400/50"
              />
              {currentUser.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-[#0D1B2A] rounded-full p-0.5">
                  <CheckCircle2 className="w-3 h-3 text-sky-500 fill-sky-500" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
          </div>

          {/* Switch / Menu */}
          <button
            type="button"
            onClick={onSwitchPeer}
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            title="Switch Account"
            aria-label="Switch Account"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Stats Ribbon */}
      <div className="sm:hidden w-full bg-white dark:bg-[#0D1B2A] border-b border-slate-100 dark:border-white/10 px-3 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none transition-colors duration-200">
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3" /><span>{currentUser.completedSessions} Sessions</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[10px] font-bold whitespace-nowrap">
          <BookOpen className="w-3 h-3" /><span>{currentUser.hoursLearned}h</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-bold whitespace-nowrap">
          <Clock className="w-3 h-3" /><span>{currentUser.hoursTaught}h</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold whitespace-nowrap">
          <Star className="w-3 h-3 fill-amber-400" /><span>{currentUser.averageRating.toFixed(1)}</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-[10px] font-bold whitespace-nowrap">
          <Award className="w-3 h-3" /><span>{currentUser.badges.length}</span>
        </div>
      </div>
    </>
  );
};
