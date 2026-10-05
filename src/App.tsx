import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  SwapRequest,
  ChatMessage,
  ModerationFlag,
  Appeal,
  Credential,
  Project,
  Achievement
} from './types';
import { INITIAL_MITS_PEERS } from './data/initialPeers';
import { DEMO_FLAGS, DEMO_SESSIONS } from './data/demoData';
import { ALL_MITS_BRANCHES } from './data/mitsBranches';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';
import { Navbar, NavigationTab } from './components/Navbar';
import { FeedView } from './components/FeedView';
import { DiscoverStudentsView } from './components/DiscoverStudentsView';
import { ProfileView } from './components/profile/ProfileView';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { ReviewsModal } from './components/ReviewsModal';
import { InitiateSwapModal } from './components/InitiateSwapModal';
import { SwapRequestsDrawer } from './components/SwapRequestsDrawer';
import { ChatModule } from './components/ChatModule';
import { VideoCallModal } from './components/VideoCallModal';
import { PostSessionFeedbackModal } from './components/PostSessionFeedbackModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SwitchPeerModal } from './components/SwitchPeerModal';

const STORAGE_KEY_USER = 'skillswap_current_user';
const STORAGE_KEY_PEERS = 'skillswap_peers';
const STORAGE_KEY_REQUESTS = 'skillswap_requests';
const STORAGE_KEY_CHATS = 'skillswap_chats';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Authenticated User State (Starts as null so Splash -> Sign Up / Log In appears on app open)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

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

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('feed');

  // Peer profile being viewed (null when viewing own profile or on feed)
  const [viewingProfilePeer, setViewingProfilePeer] = useState<UserProfile | null>(null);

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

  // Moderation & Appeals state for Coordinator console
  const [moderationFlags, setModerationFlags] = useState<ModerationFlag[]>(DEMO_FLAGS);
  const [appeals, setAppeals] = useState<Appeal[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

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

    // If new user, insert into peers list so they appear in MITS directory
    setPeers((prev) => {
      const exists = prev.some((p) => p.id === user.id);
      if (!exists) {
        return [user, ...prev];
      }
      return prev.map((p) => (p.id === user.id ? user : p));
    });
  };

  // Initiate Swap Flow
  const handleInitiateSwap = (peer: UserProfile) => {
    setInitiatingPeer(peer);
  };

  const handleConfirmSwap = (skillOrOffered: string, skillWanted?: string) => {
    if (!currentUser || !initiatingPeer) return;

    const actualSkillWanted = skillWanted || skillOrOffered;
    const actualSkillOffered = skillWanted
      ? skillOrOffered
      : currentUser.skillsOffered[0] || 'General Knowledge';

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
      status: 'pending',
      createdAt: 'Just now',
      roomId: `SkillSwap_Room_MITS_${Date.now()}`,
    };

    setSwapRequests((prev) => [newRequest, ...prev]);
    setIsRequestsDrawerOpen(true);
  };

  // Accept Swap Request
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
    const currentBranchCode =
      ALL_MITS_BRANCHES.find((b) => b.value === currentUser.department)?.code ||
      currentUser.department;
    const newReview = {
      id: `rev-${Date.now()}`,
      sessionId: feedbackSessionRequest.id,
      reviewerId: currentUser.id,
      reviewerName: `${currentUser.name} (${currentBranchCode}, ${currentUser.year})`,
      reviewerAvatar: currentUser.avatar,
      rating: rating,
      skillLearned:
        feedbackSessionRequest.skillWanted ||
        feedbackSessionRequest.skill ||
        'Session Skill',
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
  const handleAddReview = (
    peerId: string,
    review: { rating: number; comment: string; skillLearned: string }
  ) => {
    if (!currentUser) return;
    const currentBranchCode =
      ALL_MITS_BRANCHES.find((b) => b.value === currentUser.department)?.code ||
      currentUser.department;
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

  // Update user from ProfileView (credentials, projects, achievements, endorsements)
  const handleUpdateProfileUser = (updated: Partial<UserProfile>) => {
    if (viewingProfilePeer) {
      const updatedPeer = { ...viewingProfilePeer, ...updated };
      setViewingProfilePeer(updatedPeer);
      setPeers((prev) =>
        prev.map((p) => (p.id === updatedPeer.id ? updatedPeer : p))
      );
      return;
    }
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setPeers((prev) =>
      prev.map((p) => (p.id === updatedUser.id ? updatedUser : p))
    );
  };

  // Calculate incoming pending requests count for current user
  const incomingPendingCount = currentUser
    ? swapRequests.filter(
        (r) => r.toUserId === currentUser.id && r.status === 'pending'
      ).length
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

  // Determine active profile to display when in Profile view
  const activeProfileUser = viewingProfilePeer || currentUser;
  const isViewingSelf = !viewingProfilePeer || viewingProfilePeer.id === currentUser.id;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Header / Profile Stats Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={viewingProfilePeer ? 'discover' : activeTab}
        onChangeTab={(tab) => {
          setViewingProfilePeer(null);
          setActiveTab(tab);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        pendingRequestsCount={incomingPendingCount}
        onOpenRequests={() => setIsRequestsDrawerOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onSwitchPeer={() => setIsSwitchPeerOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-12 space-y-6">
        {/* VIEW 1: Profile View (If viewing a peer OR activeTab is 'profile') */}
        {(viewingProfilePeer || activeTab === 'profile') && (
          <ProfileView
            user={activeProfileUser}
            currentUser={currentUser}
            isCurrentUser={isViewingSelf}
            onBack={() => setViewingProfilePeer(null)}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onRequestSession={(peer) => handleInitiateSwap(peer)}
            onOpenChat={(peer) => {
              const req = swapRequests.find(
                (r) =>
                  (r.fromUserId === currentUser.id && r.toUserId === peer.id) ||
                  (r.toUserId === currentUser.id && r.fromUserId === peer.id)
              );
              if (req) {
                setActiveChatRequest(req);
              } else {
                handleInitiateSwap(peer);
              }
            }}
            onUpdateUser={handleUpdateProfileUser}
          />
        )}

        {/* VIEW 2: Feed View */}
        {!viewingProfilePeer && activeTab === 'feed' && (
          <FeedView
            currentUser={currentUser}
            peers={peers}
            swapRequests={swapRequests}
            onNavigateTab={(tab) => {
              setViewingProfilePeer(null);
              setActiveTab(tab);
            }}
            onViewPeerProfile={(peer) => setViewingProfilePeer(peer)}
            onRequestSession={(peer) => handleInitiateSwap(peer)}
            onOpenRequestsDrawer={() => setIsRequestsDrawerOpen(true)}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
          />
        )}

        {/* VIEW 3: Discover Students View */}
        {!viewingProfilePeer && activeTab === 'discover' && (
          <DiscoverStudentsView
            currentUser={currentUser}
            peers={peers}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            onViewProfile={(peer) => setViewingProfilePeer(peer)}
            onRequestSession={(peer) => handleInitiateSwap(peer)}
            activeRequests={swapRequests}
          />
        )}

        {/* VIEW 4: Campus Coordinator Console */}
        {!viewingProfilePeer && activeTab === 'coordinator' && (
          <CoordinatorDashboard
            allStudents={peers}
            allSessions={swapRequests}
            moderationFlags={moderationFlags}
            appeals={appeals}
            onDismissFlag={(flagId) => {
              setModerationFlags((prev) =>
                prev.map((f) => (f.id === flagId ? { ...f, status: 'dismissed' } : f))
              );
            }}
            onActionFlag={(flagId) => {
              setModerationFlags((prev) =>
                prev.map((f) => (f.id === flagId ? { ...f, status: 'actioned' } : f))
              );
            }}
            onAcceptAppeal={(appealId) => {
              setAppeals((prev) =>
                prev.map((a) => (a.id === appealId ? { ...a, status: 'accepted' } : a))
              );
            }}
            onRejectAppeal={(appealId) => {
              setAppeals((prev) =>
                prev.map((a) => (a.id === appealId ? { ...a, status: 'rejected' } : a))
              );
            }}
            onIssueCertificate={(userId) => {
              // Certificate issued
            }}
            onSuspendUser={(userId) => {
              setPeers((prev) =>
                prev.map((p) => p.id === userId ? { ...p, suspended: true, strikes: Math.max(p.strikes, 3) } : p)
              );
              if (currentUser?.id === userId) {
                setCurrentUser((prev) => prev ? { ...prev, suspended: true } : prev);
              }
            }}
            onRestoreUser={(userId) => {
              setPeers((prev) =>
                prev.map((p) => p.id === userId ? { ...p, suspended: false, appealPending: false } : p)
              );
              if (currentUser?.id === userId) {
                setCurrentUser((prev) => prev ? { ...prev, suspended: false, appealPending: false } : prev);
              }
            }}
            onWarnUser={(userId) => {
              setPeers((prev) =>
                prev.map((p) => p.id === userId ? { ...p, strikes: Math.min((p.strikes || 0) + 1, 3) } : p)
              );
            }}
            onBack={() => setActiveTab('feed')}
          />
        )}
      </main>

      {/* Subtle Floating AI Assistant */}
      <AIAssistantWidget
        currentUser={currentUser}
        peers={peers}
        onViewPeerProfile={(peer) => setViewingProfilePeer(peer)}
        onRequestSession={(peer) => handleInitiateSwap(peer)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-[#0c1524] border-t border-slate-200/80 dark:border-white/10 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">SkillSwap</span>
            <span>•</span>
            <span>Madhav Institute of Technology &amp; Science, Gwalior (MITS)</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Verified Student Network</span>
            <span>•</span>
            <span>Jitsi WebRTC Video</span>
            <span>•</span>
            <span>Peer Learning Credentials</span>
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

      {/* MODAL 4: Switch Peer Account */}
      {isSwitchPeerOpen && (
        <SwitchPeerModal
          currentUserId={currentUser.id}
          allPeers={peers}
          onSelectUser={(selected) => {
            setCurrentUser(selected);
            setViewingProfilePeer(null);
          }}
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
          currentUser={currentUser}
          currentUserId={currentUser.id}
          onSendMessage={handleSendMessage}
          onFlagMessage={(category, severity, messageContent) => {
            const flag = {
              id: `flag-${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              sessionId: activeChatRequest.id,
              messageContent,
              contentType: 'chat' as const,
              category,
              severity: severity as any,
              status: 'pending' as const,
              strikeIssued: severity === 'critical' || severity === 'high',
              createdAt: new Date().toISOString(),
            };
            setModerationFlags((prev) => [flag, ...prev]);
            if (severity === 'critical' || severity === 'high') {
              // Issue a strike on the user; suspend if strikes reach 3
              setCurrentUser((prev) => {
                if (!prev) return prev;
                const newStrikes = Math.min((prev.strikes || 0) + 1, 3);
                return { ...prev, strikes: newStrikes, suspended: prev.suspended || newStrikes >= 3 };
              });
              setPeers((prev) =>
                prev.map((p) => {
                  if (p.id === currentUser.id) {
                    const newStrikes = Math.min((p.strikes || 0) + 1, 3);
                    return { ...p, strikes: newStrikes, suspended: p.suspended || newStrikes >= 3 };
                  }
                  return p;
                })
              );
            }
          }}
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
