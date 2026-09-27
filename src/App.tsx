import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  SwapRequest,
  ChatMessage,
  NanoSkill
} from './types';
import { INITIAL_MITS_PEERS } from './data/initialPeers';
import { NANO_SKILLS_LIBRARY } from './data/skillsLibrary';
import { ALL_MITS_BRANCHES } from './data/mitsBranches';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { PeerCard } from './components/PeerCard';
import { ReviewsModal } from './components/ReviewsModal';
import { InitiateSwapModal } from './components/InitiateSwapModal';
import { SwapRequestsDrawer } from './components/SwapRequestsDrawer';
import { ChatModule } from './components/ChatModule';
import { VideoCallModal } from './components/VideoCallModal';
import { PostSessionFeedbackModal } from './components/PostSessionFeedbackModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SwitchPeerModal } from './components/SwitchPeerModal';
import {
  Search,
  Filter,
  Sparkles,
  ArrowRightLeft,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Plus,
  Flame,
  Award,
  Video
} from 'lucide-react';

const STORAGE_KEY_USER = 'skillswap_current_user';
const STORAGE_KEY_PEERS = 'skillswap_peers';
const STORAGE_KEY_REQUESTS = 'skillswap_requests';
const STORAGE_KEY_CHATS = 'skillswap_chats';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Authenticated User State (Starts as null so Splash -> Sign Up / Log In appears on app open)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // All Peers in Feed (MITS Gwalior only)
  const [peers, setPeers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PEERS);
      if (saved) {
        const parsed: UserProfile[] = JSON.parse(saved);
        const valid = parsed.filter((p) => !p.id.startsWith('mits-peer-'));
        if (valid.length > 0) return valid;
      }
      return INITIAL_MITS_PEERS;
    } catch {
      return INITIAL_MITS_PEERS;
    }
  });

  // Swap Requests
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (saved) {
        const parsed: SwapRequest[] = JSON.parse(saved);
        return parsed.filter((r) => r.id !== 'req-sample-1');
      }
      return [];
    } catch {
      return [];
    }
  });

  // Chat Messages map: { [requestId]: ChatMessage[] }
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed['req-sample-1'];
        return parsed;
      }
      return {};
    } catch {
      return {};
    }
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterSkillWanted, setFilterSkillWanted] = useState('');

  // Modals & Drawers
  const [inspectingPeer, setInspectingPeer] = useState<UserProfile | null>(null);
  const [initiatingPeer, setInitiatingPeer] = useState<UserProfile | null>(null);
  const [isRequestsDrawerOpen, setIsRequestsDrawerOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSwitchPeerOpen, setIsSwitchPeerOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  // Live Active Session States
  const [activeChatRequest, setActiveChatRequest] = useState<SwapRequest | null>(null);
  const [activeVideoRequest, setActiveVideoRequest] = useState<SwapRequest | null>(null);
  const [feedbackSessionRequest, setFeedbackSessionRequest] = useState<SwapRequest | null>(null);

  // Persistence effects
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PEERS, JSON.stringify(peers));
  }, [peers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(swapRequests));
  }, [swapRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Handle Login/Signup Completion
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsNewAccountModalOpen(false);

    // If new user, also insert into peers list so they appear in MITS directory
    setPeers((prev) => {
      const exists = prev.some((p) => p.id === user.id);
      if (!exists) {
        return [user, ...prev];
      }
      return prev;
    });
  };

  // Initiate Swap Flow
  const handleInitiateSwap = (peer: UserProfile) => {
    setInitiatingPeer(peer);
  };

  const handleConfirmSwap = (skillOrOffered: string, skillWanted?: string) => {
    if (!currentUser || !initiatingPeer) return;

    const actualSkillWanted = skillWanted || skillOrOffered;
    const actualSkillOffered = skillWanted ? skillOrOffered : (currentUser.skillsOffered[0] || 'General Knowledge');

    const newRequest: SwapRequest = {
      id: `req-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserAvatar: currentUser.avatar,
      toUserId: initiatingPeer.id,
      toUserName: initiatingPeer.name,
      toUserAvatar: initiatingPeer.avatar,
      skillOffered: actualSkillOffered,
      skillWanted: actualSkillWanted,
      status: 'pending', // Starts as pending confirmation
      createdAt: 'Just now',
      roomId: `SkillSwap_Room_MITS_${Date.now()}`,
    };

    setSwapRequests((prev) => [newRequest, ...prev]);
    setIsRequestsDrawerOpen(true);
  };

  // Accept Swap Request (Simulated or Real)
  const handleAcceptRequest = (requestId: string) => {
    setSwapRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      )
    );
  };

  // Decline Swap Request
  const handleDeclineRequest = (requestId: string) => {
    setSwapRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: 'declined' as const } : req
      )
    );
  };

  // Chat message sending
  const handleSendMessage = (text: string) => {
    if (!activeChatRequest || !currentUser) return;
    const reqId = activeChatRequest.id;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: reqId,
      requestId: reqId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setChatMessages((prev) => ({
      ...prev,
      [reqId]: [...(prev[reqId] || []), newMsg],
    }));

    // Simulated peer response after 1.5s
    setTimeout(() => {
      const peerReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sessionId: reqId,
        requestId: reqId,
        senderId: activeChatRequest.toUserId || activeChatRequest.traineeId || '',
        senderName: activeChatRequest.toUserName || activeChatRequest.traineeName || 'Peer',
        text: `Got it! Looking forward to our session. Click the video icon above whenever you are ready! 👍`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setChatMessages((prev) => ({
        ...prev,
        [reqId]: [...(prev[reqId] || []), peerReply],
      }));
    }, 1500);
  };

  // Video call completion handler (triggers Post-Session Feedback Modal)
  const handleVideoCallEnd = () => {
    const finishedReq = activeVideoRequest;
    setActiveVideoRequest(null);
    if (finishedReq) {
      setFeedbackSessionRequest(finishedReq);
    }
  };

  // Post-Session Feedback submission
  const handleSubmitReview = (rating: number, comment: string) => {
    if (!feedbackSessionRequest || !currentUser) return;

    // 1. Award +1 Credit back to wallet balance
    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        credits: (prev.credits ?? 0) + 1,
        hoursLearned: prev.hoursLearned + 1,
      };
    });

    // 2. Insert review directly into peer's permanent record
    const targetPeerId = feedbackSessionRequest.toUserId;
    const currentBranchCode = ALL_MITS_BRANCHES.find((b) => b.value === currentUser.department)?.code || currentUser.department;
    const newReview = {
      id: `rev-${Date.now()}`,
      sessionId: feedbackSessionRequest.id,
      reviewerId: currentUser.id,
      reviewerName: `${currentUser.name} (${currentBranchCode}, ${currentUser.year})`,
      reviewerAvatar: currentUser.avatar,
      rating: rating,
      skillLearned: feedbackSessionRequest.skillWanted || feedbackSessionRequest.skill || 'Session Skill',
      comment,
      date: 'Just now',
    };

    setPeers((prev) =>
      prev.map((peer) => {
        if (peer.id === targetPeerId) {
          const updatedReviews = [newReview, ...peer.reviews];
          const sumRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          const avg = sumRatings / updatedReviews.length;
          return {
            ...peer,
            hoursTaught: peer.hoursTaught + 1,
            totalReviews: updatedReviews.length,
            averageRating: parseFloat(avg.toFixed(1)),
            reviews: updatedReviews,
          };
        }
        return peer;
      })
    );

    // 3. Mark request completed
    setSwapRequests((prev) =>
      prev.map((req) =>
        req.id === feedbackSessionRequest.id
          ? { ...req, status: 'completed' as const }
          : req
      )
    );

    setFeedbackSessionRequest(null);
  };

  // Direct Review addition
  const handleAddReview = (peerId: string, review: { rating: number; comment: string; skillLearned: string }) => {
    if (!currentUser) return;
    const currentBranchCode = ALL_MITS_BRANCHES.find((b) => b.value === currentUser.department)?.code || currentUser.department;
    const newReview = {
      id: `rev-${Date.now()}`,
      sessionId: `session-direct-${Date.now()}`,
      reviewerId: currentUser.id,
      reviewerName: `${currentUser.name} (${currentBranchCode}, ${currentUser.year})`,
      reviewerAvatar: currentUser.avatar,
      rating: review.rating,
      skillLearned: review.skillLearned,
      comment: review.comment,
      date: 'Just now',
    };

    setPeers((prev) =>
      prev.map((peer) => {
        if (peer.id === peerId) {
          const updatedReviews = [newReview, ...peer.reviews];
          const sumRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          const avg = sumRatings / updatedReviews.length;
          return {
            ...peer,
            totalReviews: updatedReviews.length,
            averageRating: parseFloat(avg.toFixed(1)),
            reviews: updatedReviews,
          };
        }
        return peer;
      })
    );

    setInspectingPeer((prev) => {
      if (prev && prev.id === peerId) {
        const updatedReviews = [newReview, ...prev.reviews];
        const sumRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
          ...prev,
          totalReviews: updatedReviews.length,
          averageRating: parseFloat((sumRatings / updatedReviews.length).toFixed(1)),
          reviews: updatedReviews,
        };
      }
      return prev;
    });
  };

  // Edit current user profile
  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);

    setPeers((prev) =>
      prev.map((p) => (p.id === currentUser.id ? updatedUser : p))
    );
  };

  // Filter peers
  const filteredPeers = peers.filter((p) => {
    // Hide current user from their own feed
    if (currentUser && p.id === currentUser.id) return false;

    // Search query matching name, skills offered, skills wanted
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skillsOffered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.skillsWanted.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const categorySkills = NANO_SKILLS_LIBRARY.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      ).map((s) => s.name.toLowerCase());

      matchesCategory = p.skillsOffered.some((skill) =>
        categorySkills.includes(skill.toLowerCase())
      );
    }

    return matchesSearch && matchesCategory;
  });

  // Calculate incoming pending requests count for current user (Instagram follow request style)
  const incomingPendingCount = currentUser
    ? swapRequests.filter((r) => r.toUserId === currentUser.id && r.status === 'pending').length
    : 0;

  // 1. Initial Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. Authentication Screen (If not logged in, or explicitly opening new account modal)
  if (!currentUser || isNewAccountModalOpen) {
    return (
      <AuthModal
        existingUsers={peers}
        onAuthSuccess={(user) => {
          handleAuthSuccess(user);
        }}
      />
    );
  }

  // 3. Master Student Dashboard (Dedicated to MITS Gwalior)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07111F] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Header / Profile Stats Bar */}
      <Navbar
        currentUser={currentUser}
        pendingRequestsCount={incomingPendingCount}
        onOpenRequests={() => setIsRequestsDrawerOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onSwitchPeer={() => setIsSwitchPeerOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* MITS Institutional Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Dedicated Campus Domain • MITS Gwalior</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight font-outfit">
              Trade Skills 1-on-1 with Verified Campus Peers
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              No cash required. Teach what you know (Coding, Design, Music, Fitness) and learn what you need from fellow students at <strong className="text-white">Madhav Institute of Technology &amp; Science</strong>.
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{peers.length} Verified Students</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>15+ Popular Skills</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-semibold">
                <Video className="w-3.5 h-3.5 text-teal-400" />
                <span>HD Jitsi 1-on-1 Video Classrooms</span>
              </div>
            </div>
          </div>

          {/* Subtle decorative campus badge background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 opacity-10 pointer-events-none hidden md:block">
            <GraduationCap className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* Search, Filter & Skill Categories Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peers by name, skill offered (e.g. 'React', 'Python', 'Guitar')..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-sky-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Offer a Skill</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRequestsDrawerOpen(true)}
                className="py-2.5 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>My Swaps ({swapRequests.length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Tech', 'Creative Arts', 'Music', 'Fitness', 'Media'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Peer Feed Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                MITS Gwalior Peer Feed
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                ({filteredPeers.length} student peers available)
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              Institutional verified peers only
            </div>
          </div>

          {filteredPeers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-700">
                No user till now
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
                No student peers registered yet on campus.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPeers.map((peer) => {
                // Find active swap request for this peer if any
                const peerReq = swapRequests.find(
                  (r) =>
                    (r.fromUserId === currentUser.id && r.toUserId === peer.id) ||
                    (r.toUserId === currentUser.id && r.fromUserId === peer.id)
                );

                return (
                  <PeerCard
                    key={peer.id}
                    peer={peer}
                    currentUserId={currentUser.id}
                    activeRequest={peerReq}
                    onViewReviews={(p) => setInspectingPeer(p)}
                    onInitiateSwap={(p) => handleInitiateSwap(p)}
                    onOpenChat={(req) => setActiveChatRequest(req)}
                    onStartVideo={(req) => setActiveVideoRequest(req)}
                    onAcceptRequest={handleAcceptRequest}
                    onDeclineRequest={handleDeclineRequest}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-[#0D1B2A] border-t border-slate-200/90 dark:border-white/10 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">SkillSwap</span>
            <span>•</span>
            <span>Madhav Institute of Technology &amp; Science, Gwalior (MITS)</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Twilio Real SMS Verification</span>
            <span>•</span>
            <span>Jitsi WebRTC Video</span>
            <span>•</span>
            <span>Skill Match Engine</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Pre-Swap Peer Review Inspection */}
      {inspectingPeer && (
        <ReviewsModal
          peer={inspectingPeer}
          currentUser={currentUser}
          onAddReview={handleAddReview}
          onClose={() => setInspectingPeer(null)}
          onInitiateSwap={(p) => {
            setInspectingPeer(null);
            handleInitiateSwap(p);
          }}
        />
      )}

      {/* MODAL 2: Initiate Swap Modal */}
      {initiatingPeer && (
        <InitiateSwapModal
          peer={initiatingPeer}
          currentUser={currentUser}
          onConfirm={handleConfirmSwap}
          onClose={() => setInitiatingPeer(null)}
        />
      )}

      {/* DRAWER: Active Swap Requests */}
      {isRequestsDrawerOpen && (
        <SwapRequestsDrawer
          requests={swapRequests}
          currentUserId={currentUser.id}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          onOpenChat={(req) => setActiveChatRequest(req)}
          onStartVideo={(req) => setActiveVideoRequest(req)}
          onClose={() => setIsRequestsDrawerOpen(false)}
        />
      )}

      {/* MODAL 3: Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          currentUser={currentUser}
          onSave={handleSaveProfile}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* MODAL 4: Switch Peer Account (Strict Test Requirement) */}
      {isSwitchPeerOpen && (
        <SwitchPeerModal
          currentUserId={currentUser.id}
          allPeers={peers}
          onSelectUser={(selected) => setCurrentUser(selected)}
          onAddNewAccount={() => {
            setIsSwitchPeerOpen(false);
            setIsNewAccountModalOpen(true);
          }}
          onClose={() => setIsSwitchPeerOpen(false)}
        />
      )}

      {/* MODAL 5: WhatsApp-Style Chat Module */}
      {activeChatRequest && (
        <ChatModule
          request={activeChatRequest}
          messages={chatMessages[activeChatRequest.id] || []}
          currentUserId={currentUser.id}
          onSendMessage={handleSendMessage}
          onStartVideoCall={() => {
            const req = activeChatRequest;
            setActiveChatRequest(null);
            setActiveVideoRequest(req);
          }}
          onClose={() => setActiveChatRequest(null)}
        />
      )}

      {/* MODAL 6: Real 1-on-1 Jitsi Meet Video Call with Live 1-Hour Countdown */}
      {activeVideoRequest && (
        <VideoCallModal
          request={activeVideoRequest}
          currentUser={currentUser}
          onCallEnd={handleVideoCallEnd}
        />
      )}

      {/* MODAL 7: Post-Session Feedback Modal */}
      {feedbackSessionRequest && (
        <PostSessionFeedbackModal
          request={feedbackSessionRequest}
          currentUser={currentUser}
          onSubmitReview={handleSubmitReview}
          onClose={() => setFeedbackSessionRequest(null)}
        />
      )}
    </div>
  );
}
