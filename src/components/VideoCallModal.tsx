import React, { useEffect, useRef, useState } from 'react';
import { UserProfile, LearningSession } from '../types';
import { PhoneOff, Clock, Video, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';

interface VideoCallModalProps {
  session?: LearningSession;
  request?: LearningSession;
  currentUser: UserProfile;
  onCallEnd: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  session,
  request,
  currentUser,
  onCallEnd,
}) => {
  const activeSession = session || request;
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  // Live 1-hour digital session countdown clock (3600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(3600);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate distinct room ID
  const roomId = useRef(
    activeSession?.roomId ||
      `SkillSwap_Room_MITS_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  ).current;

  const meetingUrl = `https://meet.jit.si/${roomId}`;

  // Digital countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleHangup();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format digital clock HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHangup = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (err) {
        console.warn('Jitsi dispose caught:', err);
      }
      jitsiApiRef.current = null;
    }
    // Instantly unmount and trigger post-session modal
    onCallEnd();
  };

  // Mount Jitsi Meet External API
  useEffect(() => {
    let isSubscribed = true;

    const initJitsi = () => {
      if (!containerRef.current) return;

      const JitsiAPI = (window as any).JitsiMeetExternalAPI;
      if (JitsiAPI) {
        try {
          // Clear any previous children in container
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          const domain = 'meet.jit.si';
          const options = {
            roomName: roomId,
            width: '100%',
            height: '100%',
            parentNode: containerRef.current,
            userInfo: {
              displayName: currentUser.username || currentUser.name,
              email: currentUser.email,
            },
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: false,
              disableDeepLinking: true,
              toolbarButtons: ['microphone', 'camera', 'chat', 'hangup', 'tileview', 'settings'],
            },
            interfaceConfigOverwrite: {
              TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat', 'hangup', 'tileview', 'settings'],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
            },
          };

          const api = new JitsiAPI(domain, options);
          jitsiApiRef.current = api;
          setIsApiLoaded(true);

          api.addEventListener('videoConferenceLeft', () => {
            if (isSubscribed) {
              handleHangup();
            }
          });

          api.addEventListener('readyToClose', () => {
            if (isSubscribed) {
              handleHangup();
            }
          });
        } catch (e) {
          console.error('Failed to instantiate JitsiMeetExternalAPI:', e);
          setIsApiLoaded(false);
        }
      }
    };

    if ((window as any).JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const scriptTimer = setTimeout(initJitsi, 600);
      return () => clearTimeout(scriptTimer);
    }

    return () => {
      isSubscribed = false;
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [roomId, currentUser]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-300">
      {/* Top Session Header & Live Countdown Clock */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-10 shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Live Video Session
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>WebRTC Live</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
              With {activeSession ? (activeSession.trainerId === currentUser.id ? activeSession.traineeName : activeSession.trainerName) || activeSession.toUserName || 'Peer' : 'Peer'} • {activeSession?.skill ? `Session #${activeSession.sessionNumber}: ${activeSession.skill}` : (activeSession?.skillOffered && activeSession?.skillWanted ? `${activeSession.skillOffered} ⇄ ${activeSession.skillWanted}` : 'Learning Session')}
            </p>
          </div>
        </div>

        {/* Actions & Live Clock */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Share/Copy Room Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border border-slate-700 cursor-pointer"
            title="Copy meeting link to open on phone or another browser"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xs:inline">Copy Link</span>
              </>
            )}
          </button>

          {/* Open Meeting in New Tab */}
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-slate-700"
            title="Open in new window for full browser performance"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>New Tab</span>
          </a>

          {/* Countdown Clock */}
          <div className="flex items-center space-x-1 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1.5 rounded-lg shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-300">
              {formatTime(secondsRemaining)}
            </span>
          </div>

          {/* End Session Button */}
          <button
            type="button"
            onClick={handleHangup}
            className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-rose-900/30 cursor-pointer"
            title="End video session"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Jitsi Meet Container Area */}
      <div className="relative flex-1 w-full h-full bg-black overflow-hidden flex items-center justify-center">
        {/* Jitsi External API node */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Fallback Direct iframe if external_api.js hasn't hooked DOM yet */}
        {!isApiLoaded && (
          <iframe
            src={`https://meet.jit.si/${roomId}#userInfo.displayName="${encodeURIComponent(
              currentUser.username || currentUser.name
            )}"&config.prejoinPageEnabled=false&config.toolbarButtons=["microphone","camera","chat","hangup"]`}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            className="absolute inset-0 w-full h-full border-0"
            title="Jitsi Video Meeting"
          />
        )}
      </div>

      {/* Bottom Sub-bar */}
      <div className="h-9 bg-slate-900/95 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center space-x-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Encrypted P2P WebRTC • Room: {roomId.slice(0, 24)}...</span>
        </div>
        <span className="shrink-0 font-medium text-slate-300">Logged in as {currentUser.username}</span>
      </div>
    </div>
  );
};
