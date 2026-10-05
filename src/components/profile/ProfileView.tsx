import React from 'react';
import { UserProfile, Credential, Project, Achievement } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { AboutCard } from './AboutCard';
import { SkillsSection } from './SkillsSection';
import { CredentialsWallet } from './CredentialsWallet';
import { ProjectsSection } from './ProjectsSection';
import { AchievementsTimeline } from './AchievementsTimeline';
import { LearningTeachingImpact } from './LearningTeachingImpact';
import { ReviewsSection } from './ReviewsSection';
import { BadgesShowcase } from './BadgesShowcase';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  currentUser: UserProfile;
  isCurrentUser: boolean;
  onBack?: () => void;
  onEditProfile: () => void;
  onRequestSession?: (user: UserProfile) => void;
  onOpenChat?: (user: UserProfile) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  isCurrentUser,
  onBack,
  onEditProfile,
  onRequestSession,
  onOpenChat,
  onUpdateUser,
}) => {
  // Handlers for adding new items
  const handleAddCredential = (cred: Omit<Credential, 'id'>) => {
    const newCred: Credential = {
      ...cred,
      id: `cred-${Date.now()}`,
    };
    const updatedCreds = [newCred, ...(user.credentials || [])];
    onUpdateUser({ credentials: updatedCreds });
  };

  const handleAddProject = (proj: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
    };
    const updatedProjects = [newProj, ...(user.projects || [])];
    onUpdateUser({ projects: updatedProjects });
  };

  const handleAddAchievement = (ach: Achievement) => {
    const updatedAchievements = [ach, ...(user.achievements || [])];
    onUpdateUser({ achievements: updatedAchievements });
  };

  const handleEndorseSkill = (skillName: string) => {
    if (isCurrentUser) return;
    const currentEndorsements = { ...(user.endorsements || {}) };
    const list = currentEndorsements[skillName] || [];

    if (list.includes(currentUser.id)) {
      // Toggle off
      currentEndorsements[skillName] = list.filter((id) => id !== currentUser.id);
    } else {
      // Endorse!
      currentEndorsements[skillName] = [...list, currentUser.id];
    }

    onUpdateUser({ endorsements: currentEndorsements });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Back button if inspecting another peer */}
      {!isCurrentUser && onBack && (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0c1524] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-400 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus Directory</span>
          </button>
        </div>
      )}

      {/* 1. HERO HEADER */}
      <ProfileHeader
        user={user}
        isCurrentUser={isCurrentUser}
        currentUser={currentUser}
        onEditProfile={onEditProfile}
        onRequestSession={() => onRequestSession?.(user)}
        onOpenChat={() => onOpenChat?.(user)}
      />

      {/* 2. PROFILE STRENGTH (Only for current user) */}
      {isCurrentUser && (
        <ProfileCompletionCard
          user={user}
          onEditProfile={onEditProfile}
          onAddSkill={onEditProfile}
          onAddCredential={() => {
            // Scroll to credentials or trigger modal
            const el = document.getElementById('section-credentials');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onAddProject={() => {
            const el = document.getElementById('section-projects');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* 3. ABOUT SECTION */}
      <AboutCard
        user={user}
        isCurrentUser={isCurrentUser}
        onEdit={onEditProfile}
      />

      {/* 4. SKILLS & VERIFICATION */}
      <SkillsSection
        user={user}
        currentUserId={currentUser.id}
        isCurrentUser={isCurrentUser}
        onAddSkill={onEditProfile}
        onEndorseSkill={handleEndorseSkill}
      />

      {/* 5. CREDENTIALS WALLET */}
      <div id="section-credentials">
        <CredentialsWallet
          credentials={user.credentials}
          isCurrentUser={isCurrentUser}
          onAddCredential={handleAddCredential}
        />
      </div>

      {/* 6. PROJECTS PORTFOLIO */}
      <div id="section-projects">
        <ProjectsSection
          projects={user.projects}
          isCurrentUser={isCurrentUser}
          onAddProject={handleAddProject}
        />
      </div>

      {/* 7. CAMPUS ACHIEVEMENTS TIMELINE */}
      <AchievementsTimeline
        achievements={user.achievements}
        isCurrentUser={isCurrentUser}
        onAddAchievement={handleAddAchievement}
      />

      {/* 8. LEARNING & TEACHING IMPACT STATS */}
      <LearningTeachingImpact user={user} />

      {/* 9. REVIEWS */}
      <ReviewsSection
        user={user}
        currentUserId={currentUser.id}
        isCurrentUser={isCurrentUser}
      />

      {/* 10. BADGES SHOWCASE */}
      <BadgesShowcase user={user} />
    </div>
  );
};
