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

// --- Credential Categories & Item ---
export type CredentialCategory = 'certification' | 'course' | 'hackathon' | 'competition' | 'achievement';

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category: CredentialCategory;
  verified: boolean;
  verificationUrl?: string;
  credentialId?: string;
  description?: string;
}

// --- Project Showcase ---
export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  date?: string;
}

// --- Achievement Milestone ---
export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  category?: 'hackathon' | 'academic' | 'competition' | 'leadership';
  badgeIcon?: string;
  description?: string;
}

// --- Activity Event ---
export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'session_completed' | 'credential_added' | 'badge_earned' | 'peer_helped' | 'project_added';
  title: string;
  detail: string;
  timestamp: string;
}

// --- User Profile (professional student identity model) ---
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  headline?: string;
  coverImage?: string;
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
  skillProficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>;
  endorsements?: Record<string, string[]>; // skillName -> array of studentIds
  credentials?: Credential[];
  projects?: Project[];
  achievements?: Achievement[];
  activityEvents?: ActivityEvent[];
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
export type ModerationStatus = 'pending' | 'reviewed' | 'dismissed' | 'actioned' | 'escalated';
export type ModerationCategory =
  | 'harassment'
  | 'hate'
  | 'sexual_inappropriate'
  | 'threats_violence'
  | 'bullying'
  | 'spam'
  | 'scam_fraud'
  | 'malicious_links'
  | 'privacy_violation'
  | 'impersonation'
  | 'academic_cheating'
  | 'credential_theft'
  | 'financial_scam'
  | 'other_unsafe'
  | 'safe';

export type AIRiskLevel = 'SAFE' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL';
export type AIAction = 'allow' | 'warn' | 'review' | 'block';

export interface AIModerationResult {
  status: 'safe' | 'flagged' | 'blocked';
  severity: ModerationSeverity;
  riskLevel: AIRiskLevel;
  categories: ModerationCategory[];
  confidence: number;
  reason: string;
  action: AIAction;
  moderatedAt: string;
  model: string;
  fallback?: boolean; // true if regex fallback was used
}

export interface ModerationFlag {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  sessionId?: string;
  messageContent: string;
  contentType: 'chat' | 'bio' | 'skill' | 'credential' | 'review' | 'report' | 'headline';
  category: string;
  severity: ModerationSeverity;
  status: ModerationStatus;
  strikeIssued: boolean;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  aiResult?: AIModerationResult;
  reportCount?: number;
  reports?: ContentReport[];
}

// --- Content Reporting ---
export type ReportCategory =
  | 'harassment'
  | 'hate'
  | 'spam'
  | 'scam'
  | 'inappropriate_content'
  | 'threat'
  | 'privacy_violation'
  | 'impersonation'
  | 'academic_cheating'
  | 'other';

export interface ContentReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  contentType: 'chat' | 'bio' | 'skill' | 'credential' | 'review' | 'profile';
  contentPreview: string;
  category: ReportCategory;
  description?: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  caseId?: string; // links to ModerationCase
}

// --- Moderation Case (escalated) ---
export type CoordinatorAction =
  | 'dismiss'
  | 'warn'
  | 'remove_content'
  | 'restrict'
  | 'suspend'
  | 'ban'
  | 'restore';

export interface ModerationCase {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  contentType: 'chat' | 'bio' | 'skill' | 'credential' | 'review' | 'profile';
  contentPreview: string;
  aiResult?: AIModerationResult;
  reportCount: number;
  reports: ContentReport[];
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  coordinatorAction?: CoordinatorAction;
  coordinatorId?: string;
  coordinatorNote?: string;
  createdAt: string;
  resolvedAt?: string;
  flagId?: string; // linked ModerationFlag if any
}

// --- Audit Log ---
export interface AuditLogEntry {
  id: string;
  caseId: string;
  userId: string;
  contentId?: string;
  aiResult?: AIModerationResult;
  reports: ContentReport[];
  coordinatorAction?: CoordinatorAction;
  coordinatorId?: string;
  timestamp: string;
  reason?: string;
  previousStatus?: string;
  newStatus?: string;
}

// --- User Moderation Status ---
export type UserModerationStatus = 'active' | 'warned' | 'under_review' | 'restricted' | 'suspended' | 'banned';

// --- Appeals ---
export interface Appeal {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  flagId: string;
  caseId?: string;
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
