import React from 'react';
import { UserProfile, AppNotification } from '../types';
import { SkillSwapLogo } from './SkillSwapLogo';
import { ThemeToggle } from './ThemeToggle';
import {
  Bell,
  CheckCircle2,
  Star,
  BookOpen,
  ArrowRightLeft,
  Shield,
  Search,
  Compass,
  Home,
  User,
  X,
  Sparkles
} from 'lucide-react';

export type NavigationTab = 'feed' | 'discover' | 'profile' | 'coordinator';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications?: AppNotification[];
  pendingRequestsCount?: number;
  onOpenRequests?: () => void;
  onOpenEditProfile?: () => void;
  onToggleNotifications?: () => void;
  onSwitchPeer: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onChangeTab,
  searchQuery,
  onSearchChange,
  notifications = [],
  pendingRequestsCount = 0,
  onOpenRequests,
  onOpenEditProfile,
  onToggleNotifications,
  onSwitchPeer,
}) => {
  const unreadCount =
    (notifications ? notifications.filter((n) => !n.read).length : 0) +
    pendingRequestsCount;

  return (
    <>
      {/* Desktop & Main Header */}
      <header className="w-full bg-white/95 dark:bg-[#060b13]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo & Campus Badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <div
              className="cursor-pointer flex items-center space-x-2"
              onClick={() => onChangeTab('feed')}
            >
              <SkillSwapLogo size="sm" />
            </div>

            {/* Campus Domain Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MITS Gwalior</span>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab === 'profile') {
                    onChangeTab('discover');
                  }
                }}
                placeholder="Search skills, students, projects..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100/80 dark:bg-[#0c1524] border border-slate-200/80 dark:border-white/10 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Navigation Items & Identity Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Nav Tabs (Desktop) */}
            <nav className="hidden sm:flex items-center space-x-1 bg-slate-100/70 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => onChangeTab('feed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'feed'
                    ? 'bg-white dark:bg-[#101c30] text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Feed</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTab('discover')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'discover'
                    ? 'bg-white dark:bg-[#101c30] text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTab('profile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'profile'
                    ? 'bg-white dark:bg-[#101c30] text-teal-600 dark:text-teal-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </nav>

            {/* Sessions / Swaps Drawer trigger */}
            <button
              type="button"
              onClick={onOpenRequests}
              className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="My Sessions & Swap Requests"
              aria-label="My Sessions & Swap Requests"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white dark:ring-[#060b13]" />
              )}
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={onToggleNotifications || onOpenRequests}
              className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-ring">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Coordinator Demo View */}
            <button
              type="button"
              onClick={() => onChangeTab(activeTab === 'coordinator' ? 'feed' : 'coordinator')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'coordinator'
                  ? 'bg-sky-500/10 text-sky-500 border border-sky-500/30'
                  : 'text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Campus Coordinator Console"
              aria-label="Campus Coordinator Console"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Avatar with Name */}
            <div
              className="flex items-center space-x-2 pl-1 cursor-pointer group"
              onClick={() => onChangeTab('profile')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onChangeTab('profile');
              }}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30 group-hover:ring-teal-500 transition-all shadow-xs"
                />
                {currentUser.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-[#060b13] rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3 text-teal-500 fill-teal-500" />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 hidden lg:inline group-hover:text-teal-500 transition-colors">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>

            {/* Switch Account */}
            <button
              type="button"
              onClick={onSwitchPeer}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Switch Campus Account"
              aria-label="Switch Campus Account"
            >
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-teal-400">
                Switch
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (When on mobile) */}
        <div className="md:hidden px-4 pb-2.5 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab === 'profile') onChangeTab('discover');
              }}
              placeholder="Search skills, peers, projects..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-100 dark:bg-[#0c1524] border border-slate-200 dark:border-white/10 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#060b13]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 px-3 py-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => onChangeTab('feed')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            activeTab === 'feed'
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('discover')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            activeTab === 'discover'
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Discover</span>
        </button>

        <button
          type="button"
          onClick={onOpenEditProfile}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-teal-500" />
          <span>Skills</span>
        </button>

        <button
          type="button"
          onClick={onOpenRequests}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 relative cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4 mb-0.5" />
          <span>Swaps</span>
          {pendingRequestsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-teal-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};
