import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LearningSession, UserProfile } from '../types';
import { checkMessage } from '../services/moderationService';
import {
  X, Send, Smile, ArrowLeft, Paperclip, Video
} from 'lucide-react';

interface ChatModuleProps {
  session?: LearningSession;
  request?: LearningSession;
  currentUser?: UserProfile;
  currentUserId?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onFlagMessage?: (category: string, severity: string, messageContent: string) => void;
  onStartVideo?: () => void;
  onStartVideoCall?: () => void;
  onCompleteSession?: () => void;
  onClose: () => void;
}

const EMOJI_PANELS: Record<string, string[]> = {
  '😊': ['😊', '😂', '🙏', '❤️', '🔥', '👍', '👏', '💯', '🎉', '✨'],
  '📚': ['📚', '💡', '✅', '📝', '🎯', '🧠', '⚡', '🚀', '💻', '🔍'],
  '👋': ['👋', '🤝', '✌️', '🫡', '💪', '👀', '🤔', '😎', '🤗', '😅'],
};

export const ChatModule: React.FC<ChatModuleProps> = ({
  session,
  request,
  currentUser,
  currentUserId,
  messages,
  onSendMessage,
  onFlagMessage,
  onStartVideo,
  onStartVideoCall,
  onCompleteSession,
  onClose,
}) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojiTab, setEmojiTab] = useState('😊');
  const bottomRef = useRef<HTMLDivElement>(null);

  const actualSession = session || request;
  const activeUserId = currentUserId || currentUser?.id || '';
  const isTrainer = (actualSession?.trainerId && actualSession.trainerId === activeUserId) || (actualSession?.fromUserId === activeUserId);
  const peerName = isTrainer
    ? (actualSession?.traineeName || actualSession?.toUserName || 'Peer')
    : (actualSession?.trainerName || actualSession?.fromUserName || 'Peer');
  const peerAvatar = isTrainer
    ? (actualSession?.traineeAvatar || actualSession?.toUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
    : (actualSession?.trainerAvatar || actualSession?.fromUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const sessionNumber = actualSession?.sessionNumber ?? 1;
  const sessionSkill = actualSession?.skill || actualSession?.skillWanted || actualSession?.skillOffered || 'Skill Swap';

  const handleVideo = onStartVideo || onStartVideoCall || (() => {});
  const handleComplete = onCompleteSession || onClose;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Moderation check
    const result = checkMessage(trimmed);
    if (result.flagged && onFlagMessage) {
      onFlagMessage(result.category, result.severity, trimmed);
    }

    onSendMessage(trimmed);
    setText('');
    setShowEmojis(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#07111F] transition-colors">
      {/* Chat Header */}
      <div className="w-full bg-white dark:bg-[#0D1B2A] border-b border-slate-200 dark:border-white/10 px-3 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={peerAvatar} alt={peerName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{peerName}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Session #{sessionNumber} • {sessionSkill} •
              <span className={isTrainer ? ' text-teal-600 dark:text-teal-400' : ' text-sky-600 dark:text-sky-400'}> {isTrainer ? 'You\'re Teaching' : 'You\'re Learning'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <button type="button" onClick={handleVideo} className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer" title="Start Video">
            <Video className="w-4 h-4" />
          </button>
          <button type="button" onClick={handleComplete}
            className="px-2.5 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 cursor-pointer">
            Complete Session
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-gradient-to-b from-slate-50 to-white dark:from-[#07111F] dark:to-[#0D1B2A]">
        {/* Session start indicator */}
        <div className="text-center mb-3">
          <span className="text-[10px] bg-sky-100 dark:bg-teal-950/60 text-sky-700 dark:text-teal-300 px-3 py-1 rounded-full font-semibold border border-sky-200 dark:border-teal-800/60">
            Session #{sessionNumber} — {sessionSkill}
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
              msg.flagged
                ? 'bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : msg.isMe
                ? 'bg-slate-900 dark:bg-teal-600 text-white rounded-br-md shadow-xs'
                : 'bg-white dark:bg-[#122337] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-md shadow-xs'
            }`}>
              {msg.flagged && (
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block mb-1">⚠️ Flagged: {msg.flagReason}</span>
              )}
              {msg.text}
              <span className={`text-[10px] block mt-1 ${msg.isMe ? 'text-slate-400 dark:text-teal-100/70' : 'text-slate-400 dark:text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Emoji Drawer */}
      {showEmojis && (
        <div className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1B2A] px-3 py-2">
          <div className="flex space-x-3 mb-2 border-b border-slate-100 dark:border-white/10 pb-1">
            {Object.keys(EMOJI_PANELS).map((tab) => (
              <button key={tab} type="button" onClick={() => setEmojiTab(tab)}
                className={`text-lg cursor-pointer ${emojiTab === tab ? 'scale-110' : 'opacity-50'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {EMOJI_PANELS[emojiTab]?.map((emoji) => (
              <button key={emoji} type="button"
                onClick={() => setText((prev) => prev + emoji)}
                className="text-xl hover:scale-125 transition-transform cursor-pointer">{emoji}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1B2A] px-3 py-2 flex items-center space-x-2 shrink-0">
        <button type="button" onClick={() => setShowEmojis(!showEmojis)}
          className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-slate-100 dark:bg-[#122337] rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent dark:border-white/10 outline-none focus:bg-white dark:focus:bg-[#122337] focus:ring-1 focus:ring-sky-500 dark:focus:ring-teal-400"
        />
        <button type="button" onClick={handleSend} disabled={!text.trim()}
          className="p-2 bg-sky-600 hover:bg-sky-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl disabled:bg-slate-300 dark:disabled:bg-slate-700 cursor-pointer transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
