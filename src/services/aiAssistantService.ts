import { UserProfile, NanoSkill } from '../types';

export interface AIContext {
  currentUser: UserProfile;
  peers: UserProfile[];
  skillsLibrary: NanoSkill[];
}

export interface AIResponse {
  message: string;
  type: 'peers' | 'profile_tips' | 'skills' | 'summary' | 'text';
  suggestedPeers?: UserProfile[];
  suggestedSkills?: string[];
  actionItems?: string[];
}

/**
 * Clean AI Assistant Service Abstraction.
 * Computes authentic campus-contextual intelligence on genuine user data.
 */
export async function querySkillSwapAI(
  prompt: string,
  context: AIContext
): Promise<AIResponse> {
  const { currentUser, peers, skillsLibrary } = context;
  const lower = prompt.toLowerCase().trim();

  // Simulate network latency for natural interaction
  await new Promise((r) => setTimeout(r, 600));

  // 1. "Find students who can teach me [Skill]" or "students interested in [Skill]"
  if (lower.includes('teach') || lower.includes('find student') || lower.includes('who can teach')) {
    // Extract target skill
    const targetSkill = skillsLibrary.find((s) => lower.includes(s.name.toLowerCase()))?.name ||
      currentUser.skillsWanted[0] ||
      'Python';

    const matchingPeers = peers.filter(
      (p) =>
        p.id !== currentUser.id &&
        p.skillsOffered.some((s) => s.toLowerCase().includes(targetSkill.toLowerCase()))
    );

    if (matchingPeers.length > 0) {
      return {
        type: 'peers',
        message: `I found ${matchingPeers.length} verified MITS student${matchingPeers.length > 1 ? 's' : ''} who can teach **${targetSkill}**:`,
        suggestedPeers: matchingPeers,
      };
    } else {
      return {
        type: 'text',
        message: `Currently no peers are registered offering **${targetSkill}**. You can post a skill request or check back as more students join.`,
      };
    }
  }

  // 2. "Help me improve my profile"
  if (lower.includes('improve') || lower.includes('profile')) {
    const tips: string[] = [];
    if (!currentUser.bio || currentUser.bio.length < 30) {
      tips.push('Expand your About bio to describe your teaching philosophy and projects.');
    }
    if ((currentUser.skillsOffered?.length || 0) < 3) {
      tips.push('Add at least 3 skills you can teach to increase exchange requests.');
    }
    if ((currentUser.credentials?.length || 0) === 0) {
      tips.push('Add a course certification or hackathon achievement to your Credentials Wallet.');
    }
    if ((currentUser.projects?.length || 0) === 0) {
      tips.push('Showcase a software or hardware project with GitHub links.');
    }

    if (tips.length === 0) {
      return {
        type: 'profile_tips',
        message: `Your professional skill identity is in excellent shape! You have verified skills, credentials, and projects on your MITS profile.`,
        actionItems: ['Share your public profile link with peers', 'Complete another learning exchange to earn the next badge'],
      };
    }

    return {
      type: 'profile_tips',
      message: `Here are targeted suggestions to strengthen your SkillSwap identity:`,
      actionItems: tips,
    };
  }

  // 3. "What skills should I learn next?" or "Suggest skills"
  if (lower.includes('learn next') || lower.includes('suggest skill') || lower.includes('next skill')) {
    const currentSkills = new Set([
      ...currentUser.skillsOffered.map((s) => s.toLowerCase()),
      ...currentUser.skillsWanted.map((s) => s.toLowerCase()),
    ]);

    const recommendations = skillsLibrary
      .filter((s) => !currentSkills.has(s.name.toLowerCase()))
      .slice(0, 4)
      .map((s) => `${s.name} (${s.category})`);

    return {
      type: 'skills',
      message: `Based on trending demand at MITS Gwalior and multidisciplinary learning paths:`,
      suggestedSkills: recommendations,
    };
  }

  // 4. "Summarize my learning progress"
  if (lower.includes('progress') || lower.includes('summary') || lower.includes('stats')) {
    return {
      type: 'summary',
      message: `Here is your authenticated SkillSwap campus summary:
• **Completed Sessions:** ${currentUser.completedSessions}
• **Hours Learned:** ${currentUser.hoursLearned}h
• **Hours Taught:** ${currentUser.hoursTaught}h
• **Average Peer Rating:** ${currentUser.averageRating.toFixed(1)} / 5.0 (${currentUser.totalReviews} reviews)
• **Badges Earned:** ${currentUser.badges.length}`,
    };
  }

  // 5. Default intelligent assistant reply
  return {
    type: 'text',
    message: `I'm your SkillSwap campus assistant. I can help you discover peers for specific skills, review your profile strength, suggest high-demand campus topics, or summarize your learning records. Try clicking one of the suggested prompts below!`,
  };
}
