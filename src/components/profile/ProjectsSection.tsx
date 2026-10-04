import React, { useState } from 'react';
import { Project } from '../../types';
import {
  Code,
  Github,
  Globe,
  Plus,
  ExternalLink,
  Layers,
  Calendar,
  X
} from 'lucide-react';

interface ProjectsSectionProps {
  projects?: Project[];
  isCurrentUser: boolean;
  onAddProject?: (proj: Omit<Project, 'id'>) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  isCurrentUser,
  onAddProject,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New project state
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('Developer');
  const [technologiesInput, setTechnologiesInput] = useState('React, TypeScript, TailwindCSS');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [date, setDate] = useState('2026');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const techs = technologiesInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddProject?.({
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim() || tagline.trim(),
      role: role.trim() || 'Developer',
      technologies: techs.length > 0 ? techs : ['Web Tech'],
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      date: date.trim() || '2026',
      featured: true,
    });

    // Reset & close
    setTitle('');
    setTagline('');
    setDescription('');
    setGithubUrl('');
    setLiveUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Engineering &amp; Campus Projects
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified repositories and applications built by students
            </p>
          </div>
        </div>

        {isCurrentUser && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="py-10 px-6 rounded-2xl bg-slate-50/60 dark:bg-[#101c30]/50 border border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No projects added yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Showcase your hackathon entries, course capstones, and open-source contributions.
          </p>
          {isCurrentUser && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              + Add First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 card-depth flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {proj.role}
                  </span>
                  {proj.date && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {proj.date}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  {proj.tagline}
                </p>

                {proj.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-2.5 leading-relaxed font-normal">
                    {proj.description}
                  </p>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-300/40 dark:border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  Verified Student Work
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Add Project Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#0c1524] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mb-1">
              Add Project to Portfolio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Highlight your software builds, hardware prototypes, or creative work.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SkillSwap MITS Platform"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Campus skill-learning network with peer verification"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Full-Stack Developer"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js, WebRTC, TailwindCSS"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description (optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What problem did it solve? What technical hurdles did you overcome?"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
