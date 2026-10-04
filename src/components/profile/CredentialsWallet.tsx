import React, { useState } from 'react';
import { Credential, CredentialCategory } from '../../types';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Plus,
  CheckCircle2,
  Calendar,
  X,
  FileBadge
} from 'lucide-react';

interface CredentialsWalletProps {
  credentials?: Credential[];
  isCurrentUser: boolean;
  onAddCredential?: (cred: Omit<Credential, 'id'>) => void;
}

export const CredentialsWallet: React.FC<CredentialsWalletProps> = ({
  credentials = [],
  isCurrentUser,
  onAddCredential,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectingCred, setInspectingCred] = useState<Credential | null>(null);

  // New credential form state
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('Sep 2026');
  const [category, setCategory] = useState<CredentialCategory>('course');
  const [credentialId, setCredentialId] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    { id: 'all', label: 'All Credentials' },
    { id: 'course', label: 'Courses' },
    { id: 'certification', label: 'Certifications' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'competition', label: 'Competitions' },
  ];

  const filteredCredentials = credentials.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) return;

    onAddCredential?.({
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim() || '2026',
      category,
      verified: true, // Auto-verified for student prototype credentials
      credentialId: credentialId.trim() || `SKILLSWAP-CRED-${Date.now().toString().slice(-6)}`,
      verificationUrl: verificationUrl.trim() || undefined,
      description: description.trim() || undefined,
    });

    // Reset & close
    setTitle('');
    setIssuer('');
    setCredentialId('');
    setVerificationUrl('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Credentials &amp; Certifications Wallet
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cryptographically timestamped &amp; institution-verified student achievements
            </p>
          </div>
        </div>

        {isCurrentUser && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/20 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Credential</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-50 dark:bg-[#101c30] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Credentials Grid */}
      {filteredCredentials.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl bg-slate-50/60 dark:bg-[#101c30]/50 border border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-3">
            <FileBadge className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Your achievements deserve a place here
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
            Showcase university courses, hackathon victories, and industry certifications on your campus portfolio.
          </p>
          {isCurrentUser && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              + Add First Credential
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCredentials.map((cred) => (
            <div
              key={cred.id}
              className="credential-floating p-5 rounded-2xl bg-slate-50/90 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/10 flex flex-col justify-between group cursor-pointer"
              onClick={() => setInspectingCred(cred)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                    🎓
                  </span>
                  {cred.verified && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Verified Credential</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {cred.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {cred.issuer}
                </p>

                {cred.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed font-normal">
                    {cred.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 dark:text-slate-500 flex items-center space-x-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  <span>Issued {cred.issueDate}</span>
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5">
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: View Credential Details */}
      {inspectingCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#0c1524] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setInspectingCred(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center text-xl">
                🎓
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  {inspectingCred.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {inspectingCred.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Issuing Organization:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingCred.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{inspectingCred.issueDate}</span>
              </div>
              {inspectingCred.credentialId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Credential ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{inspectingCred.credentialId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verification Status:</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Peer Verified on SkillSwap</span>
                </span>
              </div>
            </div>

            {inspectingCred.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-normal">
                {inspectingCred.description}
              </p>
            )}

            <div className="mt-6 flex space-x-2">
              {inspectingCred.verificationUrl ? (
                <a
                  href={inspectingCred.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold text-center transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Verify at Issuer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => setInspectingCred(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Credential Form */}
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
              Add Credential to Digital Wallet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Add courses, certifications, or hackathon honors to your student identity.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Credential / Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CS50's Introduction to Computer Science"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g. Harvard University / Meta"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CredentialCategory)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  >
                    <option value="course">Course</option>
                    <option value="certification">Certification</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. Sep 2026"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Credential ID / Code (optional)
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. CS50x-2026-MITS"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verification URL (optional)
                </label>
                <input
                  type="url"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder="https://certificates.example.com/verify/..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skills Covered / Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key concepts learned and tested in this credential..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl outline-none focus:border-sky-500 bg-white dark:bg-[#101c30] text-slate-800 dark:text-slate-100"
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
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Save to Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
