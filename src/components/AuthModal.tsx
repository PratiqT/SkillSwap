import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { SkillDropdown } from './SkillDropdown';
import { MITS_BRANCH_CATEGORIES } from '../data/mitsBranches';
import { INSTITUTIONS, validateInstitutionEmail } from '../data/institutions';
import { LoginVisual3D } from './LoginVisual3D';
import { ThemeToggle } from './ThemeToggle';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  MapPin,
  Shield,
  Mail,
  X,
  Camera,
  Upload,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  onAuthSuccess: (user: UserProfile) => void;
  existingUsers?: UserProfile[];
}

type AuthStep = 'institution' | 'verify' | 'profile';

export const AuthModal: React.FC<AuthModalProps> = ({ onAuthSuccess, existingUsers = [] }) => {
  const [step, setStep] = useState<AuthStep>('institution');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Profile fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  );
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [bio, setBio] = useState('');
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [offeredInput, setOfferedInput] = useState('');
  const [wantedInput, setWantedInput] = useState('');
  const [showOfferedDropdown, setShowOfferedDropdown] = useState(false);
  const [showWantedDropdown, setShowWantedDropdown] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const DEMO_OTP = '234689';

  const institution = INSTITUTIONS.find((i) => i.id === selectedInstitution);

  // Handle email verification
  const handleSendOtp = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your institutional email');
      return;
    }
    if (!validateInstitutionEmail(cleanEmail, selectedInstitution)) {
      const inst = INSTITUTIONS.find((i) => i.id === selectedInstitution);
      setEmailError(
        `Please use your institutional email (e.g. student@${
          inst?.emailDomains[0] || 'college.ac.in'
        })`
      );
      return;
    }

    // Check if already registered
    const normalizedEmail = cleanEmail.toLowerCase();
    const existing = (existingUsers || []).find(
      (u) => u.email?.trim().toLowerCase() === normalizedEmail
    );
    if (existing) {
      onAuthSuccess(existing);
      return;
    }

    setEmailError('');
    setSendingOtp(true);
    // Simulate OTP send (in production, this connects to Twilio service)
    await new Promise((r) => setTimeout(r, 800));
    setSendingOtp(false);
    setOtpSent(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');
    if (otp === DEMO_OTP) {
      setOtpError('');
      setIsVerified(true);
      setTimeout(() => setStep('profile'), 1200);
    } else {
      setOtpError('Invalid OTP. Demo OTP: 234689');
    }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || skillsOffered.length === 0 || skillsWanted.length === 0) return;

    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: username.trim() || name.trim().toLowerCase().replace(/\s+/g, '_'),
      avatar,
      email: email.trim(),
      institutionId: selectedInstitution || 'mits-gwalior',
      college: institution?.shortName || 'MITS Gwalior',
      department,
      year,
      bio: bio.trim() || `${year} ${department} student`,
      verified: true,
      verificationBadge: 'Verified MITS Student',
      completedSessions: 0,
      hoursTaught: 0,
      hoursLearned: 0,
      totalReviews: 0,
      averageRating: 0,
      skillsOffered,
      skillsWanted,
      reviews: [],
      badges: [
        {
          badgeId: 'aarambh',
          earnedAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        },
      ],
      strikes: 0,
      suspended: false,
      appealPending: false,
      credits: 10,
    };
    onAuthSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#07111F] text-slate-900 dark:text-slate-100 overflow-y-auto selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Decorative ambient backdrop lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-3xl pointer-events-none" />

      {/* Top Controls: Dark/Light Mode Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center space-x-2">
        <ThemeToggle />
      </div>

      {/* Main Glassmorphic Split Container */}
      <div className="w-full max-w-5xl rounded-3xl bg-white/85 dark:bg-[#0D1B2A]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] my-auto">
        {/* ============================================================== */}
        {/* LEFT COLUMN: 3D Visual & Campus Brand Area */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 bg-gradient-to-br from-slate-100/70 via-teal-50/40 to-sky-50/30 dark:from-[#091524] dark:via-[#0B1A2C] dark:to-[#07111F] border-b lg:border-b-0 lg:border-r border-slate-200/70 dark:border-white/10 flex items-center justify-center p-4 sm:p-8 relative">
          <LoginVisual3D />
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Authentication Card Flow */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center p-5 sm:p-8 lg:p-10 relative">
          {/* Step Progress Pill Indicator */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 'institution'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {step === 'institution' ? '1' : <Check className="w-3.5 h-3.5" />}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Institution
              </span>

              <span className="text-slate-300 dark:text-slate-600">→</span>

              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 'verify'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : step === 'profile'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {step === 'profile' ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Verify
              </span>

              <span className="text-slate-300 dark:text-slate-600">→</span>

              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 'profile'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                3
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Profile
              </span>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: Select Institution */}
          {/* ------------------------------------------------------------ */}
          {step === 'institution' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-outfit">
                  Select Your Institution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  SkillSwap operates within verified campus networks to maintain student safety.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {INSTITUTIONS.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => {
                      setSelectedInstitution(inst.id);
                      if (inst.status === 'active') setStep('verify');
                    }}
                    disabled={inst.status !== 'active'}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      inst.status === 'active'
                        ? 'bg-white dark:bg-[#122337] hover:bg-teal-50/50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-white/10 hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/50 dark:border-teal-800/40 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {inst.shortName}
                          </h4>
                          {inst.status === 'active' ? (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.2 rounded-full">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {inst.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-0.5" />
                            {inst.city}, {inst.state}
                          </span>
                          {inst.studentCount && <span>• {inst.studentCount} students</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>Only enrolled students with institutional emails can join.</span>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: Email & OTP Verification */}
          {/* ------------------------------------------------------------ */}
          {step === 'verify' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('institution')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Back to institution selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">
                    Student Email Verification
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {institution?.shortName} • Campus Single Sign-On
                  </p>
                </div>
              </div>

              {isVerified ? (
                <div className="flex flex-col items-center text-center py-8 space-y-3 animate-slide-up">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Identity Verified Successfully!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Connecting you to {institution?.shortName} peer network...
                    </p>
                  </div>
                </div>
              ) : !otpSent ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/30 flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      Enter your official <strong>{institution?.shortName}</strong> student email
                      address to verify your campus identity.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Institutional Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      placeholder={`student@${institution?.emailDomains[0] || 'mitsgwl.ac.in'}`}
                      className="w-full px-4 py-2.5 text-sm bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-2xs"
                    />
                    {emailError && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {sendingOtp ? (
                      <span>Sending OTP Code...</span>
                    ) : (
                      <>
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    Existing users will be signed in directly upon email match.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 border border-teal-500/30 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Enter Verification Code
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      OTP sent to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>
                    </p>
                    <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-300/60 dark:border-amber-700/50 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      Demo OTP: 234689
                    </div>
                  </div>

                  {/* 6 Digit Input */}
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-10 h-12 text-center text-lg font-bold bg-white dark:bg-[#07111F] border-2 border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white transition-all"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 text-center font-medium">
                      {otpError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Resend OTP or Change Email
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: Complete Student Profile Setup */}
          {/* ------------------------------------------------------------ */}
          {step === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-200/80 dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                    Complete Student Profile
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {institution?.shortName} • Verified Student Account
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                {/* Photo Upload */}
                <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#122337] border border-slate-200 dark:border-white/10">
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/40"
                    />
                    <label
                      htmlFor="auth-avatar"
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                    <input
                      id="auth-avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Profile Photo
                    </span>
                    <label
                      htmlFor="auth-avatar"
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer mt-0.5"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload picture</span>
                    </label>
                  </div>
                </div>

                {/* Name & Username */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Prateek Sharma"
                      required
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="prateek_mits"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Department & Year */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white cursor-pointer"
                    >
                      {MITS_BRANCH_CATEGORIES.map((cat) => (
                        <optgroup key={cat.category} label={cat.category}>
                          {cat.branches.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white cursor-pointer"
                    >
                      {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bio / Headline
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder="e.g. 3rd year CSE, enthusiastic about React & Algorithms..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                {/* Skills Offered */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Skills I Can Teach *</span>
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {skillsOffered.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center text-[10px] font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800/40"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => setSkillsOffered(skillsOffered.filter((x) => x !== s))}
                          className="ml-1 text-sky-500 hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
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
                    placeholder="Type or select skill..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-400 text-slate-900 dark:text-white"
                  />
                  {showOfferedDropdown && (
                    <div className="mt-1">
                      <SkillDropdown
                        searchTerm={offeredInput}
                        selectedSkills={skillsOffered}
                        onSelectSkill={(s) => {
                          if (!skillsOffered.includes(s)) setSkillsOffered([...skillsOffered, s]);
                          setOfferedInput('');
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Skills Wanted */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>Skills I Want to Learn *</span>
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {skillsWanted.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center text-[10px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800/40"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => setSkillsWanted(skillsWanted.filter((x) => x !== s))}
                          className="ml-1 text-teal-500 hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
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
                    placeholder="Type or select skill..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#07111F] border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white"
                  />
                  {showWantedDropdown && (
                    <div className="mt-1">
                      <SkillDropdown
                        searchTerm={wantedInput}
                        selectedSkills={skillsWanted}
                        onSelectSkill={(s) => {
                          if (!skillsWanted.includes(s)) setSkillsWanted([...skillsWanted, s]);
                          setWantedInput('');
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || skillsOffered.length === 0 || skillsWanted.length === 0}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold shadow-md shadow-teal-900/20 transition-all cursor-pointer mt-2"
                >
                  Create Campus Profile & Start Learning
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
