import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, BookOpen, Check } from 'lucide-react';

interface InitiateSwapModalProps {
  peer: UserProfile;
  currentUser: UserProfile;
  onConfirm: (skill: string, skillWanted?: string) => void;
  onClose: () => void;
}

export const InitiateSwapModal: React.FC<InitiateSwapModalProps> = ({
  peer,
  currentUser,
  onConfirm,
  onClose,
}) => {
  const [selectedSkill, setSelectedSkill] = useState(peer.skillsOffered[0] || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;
    onConfirm(selectedSkill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-[#122337]">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-sky-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Request Learning Session</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Peer Info */}
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40">
            <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{peer.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{peer.college} • {peer.department}</p>
            </div>
          </div>

          {/* Skill Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              What skill do you want to learn from {peer.name.split(' ')[0]}?
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {peer.skillsOffered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-2.5 rounded-lg text-xs font-semibold text-left border transition-all cursor-pointer ${
                    selectedSkill === skill
                      ? 'bg-sky-50 dark:bg-teal-950/40 border-sky-500 dark:border-teal-400 text-sky-900 dark:text-teal-200 shadow-xs'
                      : 'bg-white dark:bg-[#122337] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{skill}</span>
                    {selectedSkill === skill && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-teal-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#122337] border border-slate-100 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-200">How it works:</strong> Once sent, your request will be pending until {peer.name.split(' ')[0]} accepts. After acceptance, you can start your learning session via chat or video.
          </div>

          <button
            type="submit"
            disabled={!selectedSkill}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Send Session Request
          </button>
        </form>
      </div>
    </div>
  );
};
