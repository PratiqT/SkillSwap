import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Award, GraduationCap, X } from 'lucide-react';

interface CertificatePreviewProps {
  student: UserProfile;
  onClose: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ student, onClose }) => {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Controls */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Certificate Preview — Institution-Controlled Recognition</span>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate */}
        <div className="p-6 sm:p-10">
          <div className="certificate-border rounded-xl p-8 sm:p-12 text-center bg-gradient-to-br from-amber-50/30 via-white to-amber-50/30">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit tracking-wide">
              CERTIFICATE OF RECOGNITION
            </h2>
            <div className="w-20 h-0.5 bg-amber-400 mx-auto mt-3 mb-6 rounded-full" />

            <p className="text-xs text-slate-600 leading-relaxed">This certificate is awarded to</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-sky-700 font-outfit mt-2">{student.name}</h3>
            <p className="text-xs text-slate-600 mt-1">{student.department} • {student.year}</p>
            <p className="text-xs text-slate-600">{student.college}</p>

            <div className="my-6 w-12 h-0.5 bg-slate-200 mx-auto rounded-full" />

            <p className="text-xs text-slate-700 leading-relaxed max-w-md mx-auto">
              For demonstrating commitment to peer learning and knowledge exchange through the SkillSwap platform,
              completing <strong>{student.completedSessions} learning sessions</strong> with an average rating
              of <strong>{student.averageRating.toFixed(1)}/5.0</strong> and earning <strong>{student.badges.length} badges</strong>.
            </p>

            <div className="mt-8 flex items-center justify-center space-x-1.5 text-amber-600">
              <Award className="w-4 h-4" />
              <span className="text-[11px] font-bold">SkillSwap Peer Learning Recognition</span>
            </div>

            <p className="text-[10px] text-slate-400 mt-4">Issued on {today}</p>
            <p className="text-[10px] text-slate-400 italic mt-1">
              This recognition is issued at the discretion of the institution coordinator and does not constitute an automatic academic credit award.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
