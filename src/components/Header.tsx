'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Layers,
  BarChart3,
  Bell,
  X,
  Home,
  Menu,
  Sparkles,
  User,
  Github,
  Info,
  ExternalLink,
} from 'lucide-react';
import { AboutProjectModal } from '@/components/AboutProjectModal';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, users, activeDraft } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Session 2026–27 Allocation Windows Active',
      desc: 'First round preferences open for Aryabhatta, Gargi, and Kalam halls.',
      time: '12m ago',
    },
    {
      id: '2',
      title: 'Deterministic Seed Run Ready',
      desc: 'Algorithm heuristic run configured with reproducible PRNG.',
      time: '8m ago',
    },
    {
      id: '3',
      title: 'Digital Allotment QR Verification Live',
      desc: 'Security caretakers can verify allotment letters via /verify.',
      time: 'Just now',
    },
  ];

  const draftStatus = activeDraft?.status || 'DRAFT';

  const getCycleStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Draft (Pre-Review)';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'APPROVED':
        return 'Approved';
      case 'PUBLISHED':
        return 'Live & Published';
      default:
        return status;
    }
  };

  const getCycleStatusTooltip = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Deterministic draft generated. Awaiting warden sign-off before official publication.';
      case 'UNDER_REVIEW':
        return 'Warden review in progress.';
      case 'APPROVED':
        return 'Warden sign-off complete. Ready for official publication.';
      case 'PUBLISHED':
        return 'Allocations are official. Letters can be printed and verified.';
      default:
        return 'Current cycle allocation state.';
    }
  };

  const getDraftBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'APPROVED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'PUBLISHED':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: Home },
    { href: '/student', label: 'Student', icon: UserCheck },
    { href: '/warden', label: 'Warden', icon: Layers },
    { href: '/admin', label: 'Inventory', icon: Building2 },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/verify', label: 'Verify', icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 w-full min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base text-white tracking-tight">EduHostel</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - XL breakpoint for spacious layout */}
            <nav className="hidden xl:flex items-center space-x-1.5 bg-slate-900/70 border border-slate-800/90 rounded-xl p-1.5 shadow-inner">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center space-x-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                      isActive
                        ? 'px-3 py-1.5 bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Repurposed Cycle Badge, GitHub, About, Notification Bell, User Switcher */}
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0 min-w-0 pr-1">
              {/* Repurposed Cycle Status Badge with descriptive label & tooltip */}
              <div
                title={getCycleStatusTooltip(draftStatus)}
                className={`hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border shrink-0 cursor-help transition-all ${getDraftBadge(
                  draftStatus
                )}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>Cycle: {getCycleStatusLabel(draftStatus)}</span>
              </div>

              {/* About Project Button */}
              <button
                onClick={() => setAboutModalOpen(true)}
                className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shrink-0"
                title="About This Project & Case Study"
              >
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>About</span>
              </button>

              {/* GitHub Repository Link */}
              <a
                href="https://github.com/YashCoder-svg/EduHostel"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shrink-0"
                title="View on GitHub"
              >
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub</span>
              </a>

            {/* Notification Bell */}
            <div className="relative shrink-0">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all relative border border-slate-700/60"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-xs text-white">Campus Broadcasts</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-xs space-y-0.5 border border-slate-800"
                      >
                        <div className="flex justify-between items-baseline">
                          <strong className="text-white text-[11px]">{n.title}</strong>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compact User Switcher with strict overflow protection */}
            <div className="relative min-w-0 max-w-[130px] sm:max-w-[165px] md:max-w-[185px]">
              <select
                id="role-switcher-select"
                aria-label="Select Testing Persona"
                className="w-full bg-slate-800/90 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700/80 pl-2.5 pr-6 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer appearance-none truncate block"
                value={currentUser.id}
                onChange={(e) => {
                  const u = users.find((x) => x.id === e.target.value);
                  if (u) setCurrentUser(u);
                }}
              >
                <optgroup label="Students">
                  {users
                    .filter((u) => u.role === 'STUDENT')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        🎓 {u.name} ({u.rollNumber})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Staff & Wardens">
                  {users
                    .filter((u) => u.role !== 'STUDENT')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.role === 'CHIEF_WARDEN'
                          ? '🏛️'
                          : u.role === 'WARDEN'
                          ? '🧑‍🏫'
                          : u.role === 'HOSTEL_ADMIN'
                          ? '⚙️'
                          : u.role === 'DSW'
                          ? '📊'
                          : '💻'}{' '}
                        {u.name}
                      </option>
                    ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* Mobile / Tablet Menu Button (active below 1280px xl breakpoint) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/70 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="xl:hidden py-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in fade-in duration-200">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAboutModalOpen(true);
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-300 hover:bg-slate-800 text-left"
            >
              <Info className="w-4 h-4" />
              <span>About Project</span>
            </button>
            <a
              href="https://github.com/YashCoder-svg/EduHostel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </nav>
        )}
      </div>
    </header>
    <AboutProjectModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </>
  );
};
