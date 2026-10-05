import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { ReportCategory } from '../types';
import { submitReport } from '../services/moderationService';

interface ReportButtonProps {
  /** The user doing the reporting */
  reporterId: string;
  /** The user being reported */
  reportedUserId: string;
  reportedUserName: string;
  /** Type of content being reported */
  contentType: 'chat' | 'bio' | 'skill' | 'credential' | 'review' | 'profile';
  /** Short preview of the content (used for dedup + case) */
  contentPreview: string;
  /** Optional: small icon-only button mode */
  compact?: boolean;
  className?: string;
}

const REPORT_CATEGORIES: { value: ReportCategory; label: string; description: string }[] = [
  { value: 'harassment', label: 'Harassment', description: 'Targeted personal attacks or repeated unwanted contact' },
  { value: 'hate', label: 'Hate Speech', description: 'Content promoting hate based on identity' },
  { value: 'spam', label: 'Spam', description: 'Unsolicited repeated messages or irrelevant content' },
  { value: 'scam', label: 'Scam / Fraud', description: 'Attempting to deceive or defraud others' },
  { value: 'inappropriate_content', label: 'Inappropriate Content', description: 'Sexual, offensive, or adult content' },
  { value: 'threat', label: 'Threat / Violence', description: 'Threatening harm to others' },
  { value: 'privacy_violation', label: 'Privacy Violation', description: 'Sharing personal information without consent' },
  { value: 'impersonation', label: 'Impersonation', description: 'Pretending to be someone else' },
  { value: 'academic_cheating', label: 'Academic Misconduct', description: 'Facilitating cheating or exam fraud' },
  { value: 'other', label: 'Other', description: 'Something not listed above' },
];

export const ReportButton: React.FC<ReportButtonProps> = ({
  reporterId,
  reportedUserId,
  reportedUserName,
  contentType,
  contentPreview,
  compact = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | ''>('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't allow users to report themselves
  if (reporterId === reportedUserId) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setSubmitted(false);
    setIsDuplicate(false);
    setSelectedCategory('');
    setDescription('');
  };

  const handleSubmit = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const result = submitReport({
      reporterId,
      reportedUserId,
      reportedUserName,
      contentType,
      contentPreview: contentPreview.slice(0, 200),
      category: selectedCategory,
      description: description.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result === null) {
      setIsDuplicate(true);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <>
      {compact ? (
        <button
          id={`report-btn-${reportedUserId}-${contentType}`}
          type="button"
          onClick={handleOpen}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer ${className}`}
          title={`Report ${reportedUserName}`}
          aria-label={`Report ${reportedUserName}`}
        >
          <Flag className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          id={`report-btn-${reportedUserId}-${contentType}`}
          type="button"
          onClick={handleOpen}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 transition-colors cursor-pointer ${className}`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report</span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="w-full max-w-md bg-white dark:bg-[#0c1524] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Report Content</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{reportedUserName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Report Submitted</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Thanks for helping keep SkillSwap safe. Your report has been submitted for review by the institution coordinator.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : isDuplicate ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Already Reported</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You have already submitted a report for this content. Our team is reviewing it.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Content preview */}
                  {contentPreview && (
                    <div className="p-3 bg-slate-50 dark:bg-[#101c30] rounded-xl border border-slate-200 dark:border-white/5">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wide">Content Preview</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">"{contentPreview}"</p>
                    </div>
                  )}

                  {/* Category selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      Reason for Report <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto">
                      {REPORT_CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            selectedCategory === cat.value
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700'
                              : 'bg-white dark:bg-[#0c1524] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span className={`font-bold block ${selectedCategory === cat.value ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {cat.label}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">{cat.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional description */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Additional Details (optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue in more detail..."
                      rows={2}
                      maxLength={500}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#101c30] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-600 resize-none"
                    />
                  </div>

                  {/* Note */}
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Your identity will not be revealed to the reported user. All reports are reviewed by the institution coordinator.
                  </p>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!selectedCategory || isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Flag className="w-3.5 h-3.5" />
                          <span>Submit Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
