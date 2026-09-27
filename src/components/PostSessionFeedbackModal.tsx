import React, { useState } from 'react';
import { UserProfile, LearningSession } from '../types';
import { Star, AlertTriangle, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface PostSessionFeedbackModalProps {
  session?: LearningSession;
  request?: LearningSession;
  currentUser: UserProfile;
  onSubmitReview: (rating: number, comment: string) => void;
  onClose: () => void;
}

export const PostSessionFeedbackModal: React.FC<PostSessionFeedbackModalProps> = ({
  session,
  request,
  currentUser,
  onSubmitReview,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const actualSession = session || request;
  const isTrainer = (actualSession?.trainerId && actualSession.trainerId === currentUser.id) || (actualSession?.fromUserId === currentUser.id);
  const peerName = isTrainer
    ? (actualSession?.traineeName || actualSession?.toUserName || 'Peer')
    : (actualSession?.trainerName || actualSession?.fromUserName || 'Peer');
  const sessionNumber = actualSession?.sessionNumber ?? 1;
  const sessionSkill = actualSession?.skill || actualSession?.skillWanted || actualSession?.skillOffered || 'Skill Swap';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSubmitReview(
          rating,
          comment || `Great learning session on ${sessionSkill}!`
        );
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 dark:bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-[#0D1B2A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base font-bold">Session #{sessionNumber} Complete!</h3>
          <p className="text-xs text-white/85 mt-0.5">
            Rate your {isTrainer ? 'teaching' : 'learning'} session with {peerName}
          </p>
          <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-full mt-1.5">{sessionSkill}</span>
        </div>

        {isSuccess ? (
          <div className="p-7 flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Review Submitted!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your review has been linked to Session #{session.sessionNumber} with {peerName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Star Rating */}
            <div className="flex flex-col items-center justify-center pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {isTrainer ? 'How was the learner?' : 'How was the teaching quality?'}
              </span>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = (hoverRating ?? rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star className={`w-7 h-7 transition-colors ${activeStar ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {rating === 5 ? '5.0 — Exceptional' : rating === 4 ? '4.0 — Very Good' : rating === 3 ? '3.0 — Good' : `${rating}.0 — Needs Improvement`}
              </span>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the session? What went well?"
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-lg outline-none focus:border-sky-500 dark:focus:border-teal-400 resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-[#122337]"
              />
            </div>

            {/* Info Note */}
            <div className="flex items-center space-x-2 text-[11px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-3 py-2 rounded-lg border border-teal-200 dark:border-teal-800/60">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>This review is permanently linked to Session #{session.sessionNumber} and will contribute to {peerName}'s reputation.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Submit Session Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
