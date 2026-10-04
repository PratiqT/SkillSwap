import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, NanoSkill } from '../types';
import { querySkillSwapAI, AIResponse } from '../services/aiAssistantService';
import { NANO_SKILLS_LIBRARY } from '../data/skillsLibrary';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ThumbsUp,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface AIAssistantWidgetProps {
  currentUser: UserProfile;
  peers: UserProfile[];
  onViewPeerProfile: (peer: UserProfile) => void;
  onRequestSession: (peer: UserProfile) => void;
  onOpenEditProfile: () => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  responsePayload?: AIResponse;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  currentUser,
  peers,
  onViewPeerProfile,
  onRequestSession,
  onOpenEditProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${currentUser.name.split(' ')[0]}! I'm your SkillSwap campus assistant. How can I help with your skill identity today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Find students who can teach me Python',
    'Help me improve my profile',
    'What skills should I learn next?',
    'Summarize my learning progress',
  ];

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await querySkillSwapAI(text.trim(), {
        currentUser,
        peers,
        skillsLibrary: NANO_SKILLS_LIBRARY,
      });

      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.message,
        responsePayload: response,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to process query right now. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Subtle Assistant Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group px-4 py-2.5 rounded-full bg-slate-900/90 dark:bg-white/10 hover:bg-slate-900 dark:hover:bg-white/15 text-white backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl flex items-center space-x-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="SkillSwap AI Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-400 to-sky-400 flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-outfit tracking-wide">
            ✦ SkillSwap AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Sleek Assistant Slide-Over / Popover Panel */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-20 right-3 sm:right-6 z-50 w-[94vw] sm:w-[410px] max-h-[82vh] h-[580px] bg-white dark:bg-[#0c1524] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-250">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-[#101c30] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-outfit">
                  SkillSwap Campus AI
                </h3>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                  MITS Verified Student Intelligence
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white rounded-tr-none'
                      : 'bg-slate-100/90 dark:bg-[#101c30] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-white/5'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Suggested Peers if returned */}
                  {msg.responsePayload?.suggestedPeers && (
                    <div className="mt-2.5 space-y-2">
                      {msg.responsePayload.suggestedPeers.map((peer) => (
                        <div
                          key={peer.id}
                          className="p-2 rounded-xl bg-white dark:bg-[#0c1524] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <img
                              src={peer.avatar}
                              alt={peer.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="block font-bold text-slate-900 dark:text-white truncate">
                                {peer.name}
                              </span>
                              <span className="block text-[10px] text-slate-400 truncate">
                                {peer.department}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onViewPeerProfile(peer);
                                setIsOpen(false);
                              }}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-teal-500 text-[10px] font-bold"
                            >
                              Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onRequestSession(peer);
                                setIsOpen(false);
                              }}
                              className="px-2 py-1 rounded bg-teal-600 text-white text-[10px] font-bold"
                            >
                              Swap
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Action Items / Profile Tips */}
                  {msg.responsePayload?.actionItems && (
                    <div className="mt-2.5 space-y-1.5">
                      {msg.responsePayload.actionItems.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-1.5 text-[11px] text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          onOpenEditProfile();
                          setIsOpen(false);
                        }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-teal-600 text-white text-[11px] font-bold"
                      >
                        Update Profile Now
                      </button>
                    </div>
                  )}

                  {/* Render Suggested Skills */}
                  {msg.responsePayload?.suggestedSkills && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.responsePayload.suggestedSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 text-[10px] font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                </div>
                <span className="text-xs">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-[#101c30] border-t border-slate-100 dark:border-white/5 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendPrompt(p)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#0c1524] text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-[10px] font-semibold whitespace-nowrap border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="p-3 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0c1524] flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SkillSwap AI..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100 dark:bg-[#101c30] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
