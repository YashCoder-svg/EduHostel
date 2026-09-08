'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, UserRole, DraftStatus } from '@/types';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Layers,
  BarChart3,
  Bell,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  draftStatus: DraftStatus;
  cycleName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSelectUser,
  activeTab,
  onChangeTab,
  draftStatus,
  cycleName,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Academic Session 2026–2027 Cycle Open',
      desc: 'Application submission window opened for UG and PG residence halls.',
      time: '10m ago',
      type: 'info',
    },
    {
      id: '2',
      title: 'Heuristic Allocation Draft Prepared',
      desc: 'Deterministic PRNG draft created. Awaiting Warden review.',
      time: '5m ago',
      type: 'draft',
    },
    {
      id: '3',
      title: 'Digital Verification Portal Online',
      desc: 'Hostel gate caretakers can scan QR codes via /verify route.',
      time: 'Just now',
      type: 'success',
    },
  ];

  const getDraftBadge = (status: DraftStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'UNDER_REVIEW':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'APPROVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PUBLISHED':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  EduHostel OS
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                  P03 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Policy-Driven Allocation & Roommate Matching
              </p>
            </div>
          </div>

          {/* Cycle & Status Badges */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
              Cycle: <strong className="text-white">{cycleName}</strong>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1.5 ${getDraftBadge(
                draftStatus
              )}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>State: {draftStatus}</span>
            </div>
          </div>

          {/* Right Controls: Notifications, Verify Portal Link, Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all relative border border-slate-700/60"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
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

            {/* Public Verify Portal Link */}
            <Link
              href="/verify"
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-indigo-700/40 transition-all"
              title="Open Public Allotment Letter Verification Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verify Letters</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>

            {/* Role Switcher */}
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Testing As</span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                {currentUser.name}
              </span>
            </div>

            <div className="relative">
              <select
                id="role-switcher-select"
                aria-label="Select Testing Persona"
                className="bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 px-3 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer appearance-none"
                value={currentUser.id}
                onChange={(e) => {
                  const u = users.find((x) => x.id === e.target.value);
                  if (u) onSelectUser(u);
                }}
              >
                <optgroup label="Students">
                  {users
                    .filter((u) => u.role === 'STUDENT')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        🎓 {u.name} ({u.rollNumber}) {u.isPwD ? '[PwD]' : ''}{' '}
                        {u.cgpa && u.cgpa < 5 ? '[Ineligible]' : ''}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Wardens & Administration">
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
                        {u.name} ({u.role.replace('_', ' ')})
                      </option>
                    ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 border-t border-slate-800/60 pt-2 pb-2 overflow-x-auto text-sm font-medium">
          <button
            id="nav-tab-portal"
            onClick={() => onChangeTab('portal')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'portal'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            id="nav-tab-bedmap"
            onClick={() => onChangeTab('bedmap')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bedmap'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Visual Bed Map (Warden)</span>
          </button>

          <button
            id="nav-tab-inventory"
            onClick={() => onChangeTab('inventory')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Inventory & Engine</span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => onChangeTab('analytics')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>DSW Analytics & Audit</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
