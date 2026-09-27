import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SkillDropdown } from './SkillDropdown';
import { MITS_BRANCH_CATEGORIES } from '../data/mitsBranches';
import { X, Plus, Sparkles, Check, Trash2, Award, Camera, Upload } from 'lucide-react';

interface EditProfileModalProps {
  currentUser: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onSave,
  onClose,
}) => {
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio);
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science & Engineering');
  const [year, setYear] = useState(currentUser.year || '3rd Year');
  const [skillsOffered, setSkillsOffered] = useState<string[]>([...currentUser.skillsOffered]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([...currentUser.skillsWanted]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Search input terms
  const [offeredInput, setOfferedInput] = useState('');
  const [wantedInput, setWantedInput] = useState('');

  // Dropdown open states
  const [showOfferedDropdown, setShowOfferedDropdown] = useState(false);
  const [showWantedDropdown, setShowWantedDropdown] = useState(false);

  // Toggle or add skill to offered
  const handleSelectOffered = (skillName: string) => {
    if (!skillsOffered.includes(skillName)) {
      setSkillsOffered([...skillsOffered, skillName]);
    } else {
      setSkillsOffered(skillsOffered.filter((s) => s !== skillName));
    }
  };

  // Toggle or add skill to wanted
  const handleSelectWanted = (skillName: string) => {
    if (!skillsWanted.includes(skillName)) {
      setSkillsWanted([...skillsWanted, skillName]);
    } else {
      setSkillsWanted(skillsWanted.filter((s) => s !== skillName));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      avatar,
      bio,
      department,
      year,
      skillsOffered,
      skillsWanted,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-[#122337]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Skills &amp; Profile (MITS Gwalior)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Configure what skills you can teach and what you want to learn.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Profile Photo Upload */}
          <div className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-[#122337] rounded-xl border border-slate-200/80 dark:border-white/10">
            <div className="relative group shrink-0">
              <img
                src={avatar}
                alt="Profile Preview"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-500/30 dark:ring-teal-400/40 shadow-xs"
              />
              <label
                htmlFor="edit-avatar-upload"
                className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="edit-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </div>
            <div className="flex-1">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Profile Photo</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Upload your authentic student photo from your phone or device.
              </p>
              <label
                htmlFor="edit-avatar-upload"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-600 dark:text-teal-400 hover:text-sky-700 dark:hover:text-teal-300 cursor-pointer bg-white dark:bg-[#0D1B2A] px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 shadow-2xs hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <Upload className="w-3 h-3" />
                <span>Choose Image</span>
              </label>
            </div>
          </div>

          {/* MITS Branch & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                MITS Branch / Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-sky-500 dark:focus:border-teal-400 text-slate-800 dark:text-slate-100 font-medium bg-white dark:bg-[#122337] cursor-pointer"
              >
                {MITS_BRANCH_CATEGORIES.map((cat) => (
                  <optgroup key={cat.category} label={cat.category} className="dark:bg-[#122337] dark:text-slate-200">
                    {cat.branches.map((b) => (
                      <option key={b.value} value={b.value} className="dark:bg-[#122337] dark:text-slate-200">
                        {b.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-sky-500 dark:focus:border-teal-400 text-slate-800 dark:text-slate-100 font-medium bg-white dark:bg-[#122337] cursor-pointer"
              >
                <option value="1st Year" className="dark:bg-[#122337] dark:text-slate-200">1st Year</option>
                <option value="2nd Year" className="dark:bg-[#122337] dark:text-slate-200">2nd Year</option>
                <option value="3rd Year" className="dark:bg-[#122337] dark:text-slate-200">3rd Year</option>
                <option value="4th Year" className="dark:bg-[#122337] dark:text-slate-200">4th Year</option>
                <option value="5th Year (B.Arch / Architecture)" className="dark:bg-[#122337] dark:text-slate-200">5th Year (B.Arch / Architecture)</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              About You &amp; Teaching Style
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-sky-500 dark:focus:border-teal-400 text-slate-800 dark:text-slate-100 bg-white dark:bg-[#122337]"
              placeholder="e.g. 3rd year CSE student, happy to teach React and learn Guitar!"
            />
          </div>

          {/* Skills Offered (Can Teach) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-teal-400" />
                <span>Skills Offered (You Can Teach)</span>
              </label>
              <span className="text-[10px] text-sky-600 dark:text-teal-400 font-semibold flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Suggestions Active
              </span>
            </div>

            {/* Tokenized Skill Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800/60"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSelectOffered(skill)}
                    className="ml-1.5 text-sky-500 dark:text-sky-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Search Input for Offered Skills */}
            <div className="relative">
              <input
                type="text"
                value={offeredInput}
                onChange={(e) => {
                  setOfferedInput(e.target.value);
                  setShowOfferedDropdown(true);
                }}
                onFocus={() => {
                  setShowOfferedDropdown(true);
                  setShowWantedDropdown(false);
                }}
                placeholder="Click or type skill (e.g. 'py', 'react', 'guitar')..."
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-sky-500 dark:focus:border-teal-400 text-slate-800 dark:text-slate-100 bg-white dark:bg-[#122337]"
              />
            </div>

            {/* Skill Suggestions Dropdown Panel */}
            {showOfferedDropdown && (
              <div className="mt-1">
                <SkillDropdown
                  searchTerm={offeredInput}
                  selectedSkills={skillsOffered}
                  onSelectSkill={(skill) => {
                    handleSelectOffered(skill);
                    setOfferedInput('');
                  }}
                />
              </div>
            )}
          </div>

          {/* Skills Wanted (Want to Learn) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Skills Wanted (You Want to Learn)</span>
              </label>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Suggestions Active
              </span>
            </div>

            {/* Tokenized Skill Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800/60"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSelectWanted(skill)}
                    className="ml-1.5 text-teal-500 dark:text-teal-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Search Input for Wanted Skills */}
            <div className="relative">
              <input
                type="text"
                value={wantedInput}
                onChange={(e) => {
                  setWantedInput(e.target.value);
                  setShowWantedDropdown(true);
                }}
                onFocus={() => {
                  setShowWantedDropdown(true);
                  setShowOfferedDropdown(false);
                }}
                placeholder="Click or type skill to search library..."
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-teal-500 text-slate-800 dark:text-slate-100 bg-white dark:bg-[#122337]"
              />
            </div>

            {/* Skill Suggestions Dropdown Panel */}
            {showWantedDropdown && (
              <div className="mt-1">
                <SkillDropdown
                  searchTerm={wantedInput}
                  selectedSkills={skillsWanted}
                  onSelectSkill={(skill) => {
                    handleSelectWanted(skill);
                    setWantedInput('');
                  }}
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 dark:bg-teal-600 dark:hover:bg-teal-500 active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
