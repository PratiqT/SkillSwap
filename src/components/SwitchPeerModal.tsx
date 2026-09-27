import React from 'react';
import { UserProfile } from '../types';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import { X, Users, CheckCircle2, UserPlus } from 'lucide-react';

interface SwitchPeerModalProps {
  currentUserId: string;
  allPeers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onAddNewAccount: () => void;
  onClose: () => void;
}

export const SwitchPeerModal: React.FC<SwitchPeerModalProps> = ({
  currentUserId,
  allPeers,
  onSelectUser,
  onAddNewAccount,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-[#122337]">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-sky-600 dark:text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Switch MITS Peer Account
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Select an authenticated MITS Gwalior student account to test two-way barter flows, chat, and live video sessions:
          </p>

          {allPeers.map((peer) => {
            const isCurrent = peer.id === currentUserId;
            return (
              <button
                key={peer.id}
                type="button"
                onClick={() => {
                  onSelectUser(peer);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-50 dark:bg-teal-950/40 border-sky-300 dark:border-teal-500/50 ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-[#122337] border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    {peer.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0D1B2A] rounded-full p-0.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-teal-400 fill-sky-500 dark:fill-teal-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{peer.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {ALL_MITS_BRANCHES.find((b) => b.value === peer.department)?.code || peer.department} • {peer.year}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      {peer.skillsOffered.slice(0, 2).map((s) => (
                        <span key={s} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                    {peer.credits !== undefined ? `${peer.credits} Credits` : `${peer.completedSessions} Sessions`}
                  </span>
                  {isCurrent && (
                    <span className="block text-[10px] font-bold text-sky-600 dark:text-teal-400 mt-1">Active</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-[#122337] border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewAccount();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-white/20 hover:border-sky-500 dark:hover:border-teal-400 hover:bg-white dark:hover:bg-[#0D1B2A] text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-teal-300 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Another Student (Twilio / Email)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
