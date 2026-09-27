import { BadgeDefinition, UserProfile, LearningSession, UserBadge } from '../types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'aarambh',
    name: 'Aarambh',
    hindiName: 'आरम्भ',
    description: 'Account created & institution verified',
    icon: '🌱',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    requirement: 'Create account and verify institutional email',
    tier: 'bronze',
  },
  {
    id: 'pratham-milan',
    name: 'Pratham Milan',
    hindiName: 'प्रथम मिलन',
    description: 'First completed learning session',
    icon: '🤝',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    requirement: 'Complete your first learning session',
    tier: 'bronze',
  },
  {
    id: 'gyan-doot',
    name: 'Gyan Doot',
    hindiName: 'ज्ञान दूत',
    description: 'Successful teaching milestone',
    icon: '📚',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    requirement: 'Successfully teach a peer in a completed session',
    tier: 'silver',
  },
  {
    id: 'jigyasa',
    name: 'Jigyasa',
    hindiName: 'जिज्ञासा',
    description: '5 completed learning sessions',
    icon: '🔍',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    requirement: 'Complete 5 learning sessions',
    tier: 'silver',
  },
  {
    id: 'nirantar',
    name: 'Nirantar',
    hindiName: 'निरंतर',
    description: '10 completed learning sessions',
    icon: '🔥',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    requirement: 'Complete 10 learning sessions',
    tier: 'gold',
  },
  {
    id: 'sahyogi',
    name: 'Sahyogi',
    hindiName: 'सहयोगी',
    description: 'Helped multiple students',
    icon: '🌟',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    requirement: 'Teach 3 or more different students',
    tier: 'gold',
  },
  {
    id: 'utkrisht-mentor',
    name: 'Utkrisht Mentor',
    hindiName: 'उत्कृष्ट मेंटर',
    description: 'High rating across completed sessions',
    icon: '👑',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    requirement: 'Maintain 4.5+ rating across 5+ teaching sessions',
    tier: 'platinum',
  },
  {
    id: 'campus-catalyst',
    name: 'Campus Catalyst',
    hindiName: 'कैम्पस उत्प्रेरक',
    description: 'Exceptional verified contribution',
    icon: '🏆',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    requirement: '15+ sessions, 4.5+ rating, earned 5+ badges',
    tier: 'platinum',
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id);
}

/** Evaluate which new badges a user has earned. Returns only NEW badge IDs. */
export function evaluateNewBadges(
  user: UserProfile,
  allSessions: LearningSession[]
): string[] {
  const existingIds = new Set(user.badges.map((b) => b.badgeId));
  const newBadges: string[] = [];

  const userSessions = allSessions.filter(
    (s) =>
      (s.trainerId === user.id || s.traineeId === user.id) &&
      s.status === 'completed'
  );
  const asTrainer = userSessions.filter((s) => s.trainerId === user.id);
  const asTrainee = userSessions.filter((s) => s.traineeId === user.id);
  const totalCompleted = userSessions.length;

  // Aarambh: Account verified
  if (!existingIds.has('aarambh') && user.verified) {
    newBadges.push('aarambh');
  }

  // Pratham Milan: First completed session (as either role)
  if (!existingIds.has('pratham-milan') && totalCompleted >= 1) {
    newBadges.push('pratham-milan');
  }

  // Gyan Doot: At least 1 completed teaching session
  if (!existingIds.has('gyan-doot') && asTrainer.length >= 1) {
    newBadges.push('gyan-doot');
  }

  // Jigyasa: 5 completed learning sessions
  if (!existingIds.has('jigyasa') && totalCompleted >= 5) {
    newBadges.push('jigyasa');
  }

  // Nirantar: 10 completed learning sessions
  if (!existingIds.has('nirantar') && totalCompleted >= 10) {
    newBadges.push('nirantar');
  }

  // Sahyogi: Taught 3+ different students
  if (!existingIds.has('sahyogi')) {
    const uniqueTrainees = new Set(asTrainer.map((s) => s.traineeId));
    if (uniqueTrainees.size >= 3) {
      newBadges.push('sahyogi');
    }
  }

  // Utkrisht Mentor: 4.5+ rating across 5+ teaching sessions
  if (!existingIds.has('utkrisht-mentor') && asTrainer.length >= 5) {
    if (user.averageRating >= 4.5) {
      newBadges.push('utkrisht-mentor');
    }
  }

  // Campus Catalyst: 15+ sessions, 4.5+ rating, 5+ badges
  if (!existingIds.has('campus-catalyst')) {
    const totalBadges = existingIds.size + newBadges.length;
    if (totalCompleted >= 15 && user.averageRating >= 4.5 && totalBadges >= 5) {
      newBadges.push('campus-catalyst');
    }
  }

  return newBadges;
}

/** Get session number for a trainer-trainee-skill relationship */
export function getSessionNumber(
  trainerId: string,
  traineeId: string,
  skill: string,
  allSessions: LearningSession[]
): number {
  const relatedSessions = allSessions.filter(
    (s) =>
      s.trainerId === trainerId &&
      s.traineeId === traineeId &&
      s.skill === skill
  );
  return relatedSessions.length + 1;
}
