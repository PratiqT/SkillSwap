// ============================================================================
// SkillSwap Core Types — Redesigned for SIH Prototype
// ============================================================================

// --- Institution ---
export interface Institution {
  id: string;
  name: string;
  shortName: string;
  emailDomains: string[];
  city: string;
  state: string;
  type: 'Engineering' | 'University' | 'College';
  status: 'active' | 'upcoming';
  description: string;
  studentCount?: string;
}

// --- User Profile (credits removed, badges/strikes added) ---
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email?: string;
  phone?: string;
  institutionId: string;
  college: string;
  department: string;
  year: string;
  bio: string;
  verified: boolean;
  verificationBadge: string;
  completedSessions: number;
  hoursTaught: number;
  hoursLearned: number;
  totalReviews: number;
  averageRating: number;
  skillsOffered: string[];
  skillsWanted: string[];
  reviews: PeerReview[];
  badges: UserBadge[];
  strikes: number;
  suspended: boolean;
  appealPending: boolean;
  credits?: number;
}

// --- Peer Review (session-linked, no arbitrary reviews) ---
export interface PeerReview {
  id: string;
  sessionId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  skillLearned: string;
  comment: string;
  date: string;
}

// --- Nano Skill Library ---
export interface NanoSkill {
  id: string;
  name: string;
  category: 'Tech' | 'Creative Arts' | 'Music' | 'Fitness' | 'Media' | 'Academics';
  rating: number;
  demandStatus: 'Highly Demanded' | 'Trending' | 'Popular' | 'Emerging' | 'Essential';
  learnDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  avgSessionDuration: string;
  description: string;
}

// --- Learning Session (replaces SwapRequest) ---
export type SessionStatus = 'requested' | 'accepted' | 'scheduled' | 'active' | 'completed' | 'cancelled' | 'pending' | 'declined';
export type SwapStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface LearningSession {
  id: string;
  trainerId?: string;
  trainerName?: string;
  trainerAvatar?: string;
  traineeId?: string;
  traineeName?: string;
  traineeAvatar?: string;
  skill?: string;
  sessionNumber?: number;
  status: SessionStatus | SwapStatus;
  createdAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  trainerConfirmed?: boolean;
  traineeConfirmed?: boolean;
  ratingSubmitted?: boolean;
  roomId?: string;

  // Backwards compatibility fields for legacy components
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  toUserId?: string;
  toUserName?: string;
  toUserAvatar?: string;
  skillOffered?: string;
  skillWanted?: string;
}

// Export SwapRequest as alias of LearningSession for backwards compatibility
export type SwapRequest = LearningSession;

// --- Chat Message ---
export interface ChatMessage {
  id: string;
  sessionId?: string;
  requestId?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  flagged?: boolean;
  flagReason?: string;
}

// --- Badge System ---
export interface UserBadge {
  badgeId: string;
  earnedAt: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  requirement: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// --- Moderation ---
export type ModerationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ModerationStatus = 'pending' | 'reviewed' | 'dismissed' | 'actioned';

export interface ModerationFlag {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  sessionId?: string;
  messageContent: string;
  category: string;
  severity: ModerationSeverity;
  status: ModerationStatus;
  strikeIssued: boolean;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// --- Appeals ---
export interface Appeal {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  flagId: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

// --- Notifications ---
export type NotificationType =
  | 'session_request'
  | 'session_accepted'
  | 'session_completed'
  | 'badge_earned'
  | 'review_received'
  | 'moderation_warning'
  | 'appeal_update';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

// --- Certificate / Recognition ---
export interface CertificateEligibility {
  minSessions: number;
  minRating: number;
  requiredBadges: string[];
  minLearningHours: number;
  maxUnresolvedViolations: number;
}
