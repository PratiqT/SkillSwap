import React, { useState, useEffect, useRef } from 'react';
import logoAsset from '../assets/images/skillswap_logo_1788606818943.jpg';
import { Sparkles, Users, Video, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface SkillNode {
  name: string;
  icon: string;
  xPercent: number; // -50 to 50
  yPercent: number; // -50 to 50
  depth: number;    // depth in px for parallax
  color: string;
}

const SKILL_NODES: SkillNode[] = [
  { name: 'Python', icon: '🐍', xPercent: -36, yPercent: -34, depth: 42, color: 'border-sky-500/30 text-sky-400' },
  { name: 'AI & ML', icon: '⚡', xPercent: 36, yPercent: -32, depth: 48, color: 'border-violet-500/30 text-violet-400' },
  { name: 'DSA', icon: '📊', xPercent: -42, yPercent: 12, depth: 36, color: 'border-emerald-500/30 text-emerald-400' },
  { name: 'React / Web', icon: '🌐', xPercent: 40, yPercent: 8, depth: 50, color: 'border-teal-500/30 text-teal-400' },
  { name: 'UI / UX', icon: '🎨', xPercent: -30, yPercent: 42, depth: 40, color: 'border-pink-500/30 text-pink-400' },
  { name: 'C++ Systems', icon: '⚙️', xPercent: 34, yPercent: 44, depth: 44, color: 'border-amber-500/30 text-amber-400' },
  { name: 'Cloud & DevOps', icon: '☁️', xPercent: 2, yPercent: -45, depth: 46, color: 'border-cyan-500/30 text-cyan-400' },
  { name: 'Cybersecurity', icon: '🛡️', xPercent: 2, yPercent: 50, depth: 38, color: 'border-rose-500/30 text-rose-400' },
];

export const LoginVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    // Clamp between -1 and 1
    const clampedX = Math.max(-1, Math.min(1, x));
    const clampedY = Math.max(-1, Math.min(1, y));
    setMousePos({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const parallaxX = mousePos.x * 10;
  const parallaxY = mousePos.y * 10;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] lg:min-h-[580px] flex flex-col items-center justify-center p-6 select-none overflow-hidden perspective-1000"
      aria-hidden="true"
    >
      {/* Background Glowing Ambient Orbs */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-teal-500/20 via-sky-500/25 to-emerald-500/20 blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${parallaxX * -0.6}px, ${parallaxY * -0.6}px)`,
        }}
      />
      <div
        className="absolute w-60 h-60 rounded-full bg-gradient-to-bl from-indigo-500/15 via-teal-500/20 to-transparent blur-2xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${parallaxX * 0.8}px, ${parallaxY * 0.8}px)`,
        }}
      />

      {/* SVG Connecting Network Web */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <circle cx="50%" cy="46%" r="130" fill="none" stroke="url(#netGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
        <circle cx="50%" cy="46%" r="200" fill="none" stroke="url(#netGrad)" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.3" />
        {/* Subtle radial radiating spokes */}
        <line x1="50%" y1="46%" x2="20%" y2="20%" stroke="url(#netGrad)" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="50%" y1="46%" x2="80%" y2="20%" stroke="url(#netGrad)" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="50%" y1="46%" x2="15%" y2="55%" stroke="url(#netGrad)" strokeWidth="1" strokeDasharray="3 5" />
        <line x1="50%" y1="46%" x2="85%" y2="55%" stroke="url(#netGrad)" strokeWidth="1" strokeDasharray="3 5" />
      </svg>

      {/* 3D Scene Root */}
      <div
        className="relative flex flex-col items-center justify-center preserve-3d transition-transform duration-300 ease-out z-10"
        style={{
          transform: reducedMotion
            ? 'none'
            : `rotateX(${-parallaxY * 0.8}deg) rotateY(${parallaxX * 0.8}deg)`,
        }}
      >
        {/* Floating Skill Nodes Around Central Logo */}
        {SKILL_NODES.map((node) => {
          const shiftX = (node.xPercent * 2.8) + (parallaxX * (node.depth / 35));
          const shiftY = (node.yPercent * 2.4) + (parallaxY * (node.depth / 35));

          return (
            <div
              key={node.name}
              className={`absolute hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border ${node.color} shadow-lg shadow-black/5 dark:shadow-black/30 pointer-events-none transition-transform duration-500 ease-out`}
              style={{
                transform: `translate3d(${shiftX}px, ${shiftY}px, ${node.depth}px)`,
              }}
            >
              <span>{node.icon}</span>
              <span className="text-slate-800 dark:text-slate-100">{node.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse ml-0.5" />
            </div>
          );
        })}

        {/* Outer 3D Holographic Pedestal / Ring */}
        <div
          className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-3xl bg-gradient-to-tr from-teal-500/20 via-sky-500/10 to-transparent border border-teal-500/30 dark:border-teal-400/20 backdrop-blur-xs shadow-2xl shadow-teal-500/10 transition-transform duration-500"
          style={{
            transform: `translate3d(0, 0, 10px) rotate(${parallaxX * 0.5}deg)`,
          }}
        />

        {/* Central 3D SkillSwap Logo Container */}
        <div
          className="relative z-20 transition-all duration-300 ease-out animate-float-slow"
          style={{
            transform: reducedMotion
              ? 'none'
              : `translate3d(0, 0, 35px) scale(${1 + Math.abs(mousePos.x) * 0.02})`,
          }}
        >
          {/* Layered drop glow behind logo */}
          <div className="absolute inset-0 rounded-3xl bg-teal-500/30 blur-xl -z-10 scale-95 transition-opacity duration-300" />

          {/* Logo Card with subtle glass frame */}
          <div className="p-3 sm:p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-teal-500/30 shadow-2xl shadow-teal-900/20 dark:shadow-black/60 relative overflow-hidden group">
            {/* Shimmer light pass */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* Existing SkillSwap Logo Asset */}
            <img
              src={logoAsset}
              alt="SkillSwap Logo"
              className="w-44 sm:w-56 md:w-64 h-auto max-h-48 object-contain rounded-2xl select-none"
              style={{
                filter: 'drop-shadow(0 12px 24px rgba(13, 148, 136, 0.25))',
              }}
            />
          </div>
        </div>

        {/* Visual Pillars & Trust Pills beneath Logo */}
        <div
          className="mt-7 flex flex-col items-center text-center space-y-2.5 transition-transform duration-500"
          style={{
            transform: `translate3d(0, 0, 20px) translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
          }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin-slow" />
            <span>Campus Barter & Peer Mentorship</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight">
            Where Campus Skills Connect.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs sm:max-w-sm leading-relaxed">
            Trade what you know, learn what you need. 100% peer barter at verified institutions with HD WebRTC classrooms.
          </p>

          {/* Quick ecosystem badges */}
          <div className="flex items-center space-x-3 pt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              <span>1-on-1 Barter</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Video className="w-3.5 h-3.5 text-teal-500" />
              <span>Jitsi Video</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Campus Verified</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
