import React from 'react';
import { ModerationSeverity } from '../types';
import { Shield, AlertTriangle, X } from 'lucide-react';

interface ModerationAlertProps {
  category: string;
  severity: ModerationSeverity;
  strikeNumber: number;
  onClose: () => void;
}

export const ModerationAlert: React.FC<ModerationAlertProps> = ({
  category,
  severity,
  strikeNumber,
  onClose,
}) => {
  const strikeLabel =
    strikeNumber === 1
      ? 'Warning Issued'
      : strikeNumber === 2
      ? 'Final Warning — Restrictions Applied'
      : 'Account Suspended — Pending Coordinator Review';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base font-bold">AI Safety Check</h3>
          <p className="text-xs text-white/85 mt-0.5">Automated content moderation detected a violation</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Detection Details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 block">Category</span>
              <span className="text-xs font-bold text-slate-900">{category}</span>
            </div>
            <div className={`rounded-lg p-2.5 text-center border ${
              severity === 'critical' || severity === 'high'
                ? 'bg-rose-50 border-rose-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <span className="text-[10px] font-semibold text-slate-500 block">Severity</span>
              <span className={`text-xs font-bold capitalize ${
                severity === 'critical' || severity === 'high' ? 'text-rose-700' : 'text-amber-700'
              }`}>{severity}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 block">Status</span>
            <span className="text-xs font-bold text-amber-700">Flagged for Review</span>
          </div>

          {/* Strike Warning */}
          <div className={`p-3 rounded-xl flex items-start space-x-2 ${
            strikeNumber >= 3
              ? 'bg-rose-50 border border-rose-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${strikeNumber >= 3 ? 'text-rose-600' : 'text-amber-600'}`} />
            <div>
              <span className={`text-xs font-bold block ${strikeNumber >= 3 ? 'text-rose-900' : 'text-amber-900'}`}>
                Strike {strikeNumber} / 3
              </span>
              <span className="text-[11px] leading-tight text-slate-700">{strikeLabel}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic text-center">
            This flag has been sent to the institution coordinator for review. Automated moderation does not result in instant bans.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
