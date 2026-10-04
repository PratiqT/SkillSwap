import React, { useState } from 'react';
import { UserProfile, PeerReview } from '../../types';
import { Star, CheckCircle2, MessageSquareQuote, Plus } from 'lucide-react';

interface ReviewsSectionProps {
  user: UserProfile;
  currentUserId?: string;
  isCurrentUser: boolean;
  onAddReview?: (review: { rating: number; comment: string; skillLearned: string }) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  user,
  currentUserId,
  isCurrentUser,
  onAddReview,
}) => {
  const reviews = user.reviews || [];

  return (
    <div className="bg-white dark:bg-[#0c1524] rounded-3xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm transition-all space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
              Verified Peer Testimonials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Session-linked feedback provided after authenticated 1-on-1 video exchanges
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{user.averageRating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({reviews.length})</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="py-8 px-6 rounded-2xl bg-slate-50/60 dark:bg-[#101c30]/50 border border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center">
          <Star className="w-8 h-8 text-amber-400 mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No session reviews yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-0.5">
            Reviews are automatically recorded after completing a 1-on-1 learning session with a campus peer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#101c30] border border-slate-200/60 dark:border-white/5 card-depth-subtle flex flex-col justify-between"
            >
              <div>
                {/* Star rating and verified badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Verified Session</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed font-normal mb-3">
                  "{rev.comment}"
                </p>

                {rev.skillLearned && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 mb-3 border border-teal-500/15">
                    Learned: {rev.skillLearned}
                  </span>
                )}
              </div>

              {/* Reviewer info */}
              <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={rev.reviewerAvatar}
                    alt={rev.reviewerName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {rev.reviewerName}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      MITS Campus Peer
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
