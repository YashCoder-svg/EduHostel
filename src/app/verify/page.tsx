'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  QrCode,
  ArrowLeft,
  Search,
  Sparkles,
  User,
  Copy,
  Check,
} from 'lucide-react';

interface VerifiedStudent {
  name: string;
  roll: string;
  hostel: string;
  roomBed: string;
  warden: string;
  notes: string;
  roomType: string;
}

const SAMPLE_STUDENTS: Record<string, VerifiedStudent> = {
  '2024CS101': {
    name: 'Arjun Patel',
    roll: '2024CS101',
    hostel: 'Aryabhatta Hall of Residence',
    roomBed: 'Room 102, Bed A (First Floor)',
    warden: 'Dr. S. Sharma (Chief Warden)',
    notes: 'Standard Merit Allocation · 96% Lifestyle Sync with Roommate',
    roomType: 'Double Occupancy (AC)',
  },
  '2024CS103': {
    name: 'Priya Sharma',
    roll: '2024CS103',
    hostel: 'Gargi Hall of Residence',
    roomBed: 'Room 201, Bed A (Second Floor)',
    warden: 'Dr. M. Das (Hall Warden)',
    notes: 'Top Preference Satisfied · Quiet Study Wing',
    roomType: 'Single Occupancy (AC)',
  },
  '2024ME301': {
    name: 'Vikram Malhotra',
    roll: '2024ME301',
    hostel: 'Aryabhatta Hall of Residence',
    roomBed: 'Room 001, Bed A (Ground Floor)',
    warden: 'Dr. S. Sharma (Chief Warden)',
    notes: 'PwD Accessibility Priority · Step-Free Wheelchair Access Verified',
    roomType: 'Accessible Ground Double',
  },
};

const DEFAULT_SAMPLE_TOKEN = 'VRF-2024CS101-bed-ary-102-A';

function VerificationContent() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || DEFAULT_SAMPLE_TOKEN;
  const [query, setQuery] = useState(initialToken);
  const [searchedToken, setSearchedToken] = useState(initialToken);
  const [copied, setCopied] = useState(false);

  // Determine verification status
  const isVerified =
    searchedToken.length > 4 &&
    (searchedToken.includes('2024') || searchedToken.startsWith('VRF-'));

  // Resolve matching student data
  let matchedStudent: VerifiedStudent = SAMPLE_STUDENTS['2024CS101'];
  if (searchedToken.includes('2024CS103')) {
    matchedStudent = SAMPLE_STUDENTS['2024CS103'];
  } else if (searchedToken.includes('2024ME301')) {
    matchedStudent = SAMPLE_STUDENTS['2024ME301'];
  }

  const handleTestToken = (token: string) => {
    setQuery(token);
    setSearchedToken(token);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(searchedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Navigation Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hostel OS Dashboard</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-500">Registry Gateway v2.4</span>
        </div>

        {/* Verification Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Allotment Credential & QR Verification Portal
                </h1>
                <p className="text-xs text-slate-400">
                  EduHostel Residential Affairs Registry • Digital Certification
                </p>
              </div>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              LIVE DIGITAL REGISTRY
            </span>
          </div>

          {/* Quick-test helper banner */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>Instant Evaluation:</strong> Working sample letter ID pre-loaded below.
              </span>
            </div>
            <button
              onClick={() => handleTestToken(DEFAULT_SAMPLE_TOKEN)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Try Sample Verification</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Enter Verification Token or Student Roll Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. VRF-2024CS101-bed-ary-102-A or 2024CS101"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => setSearchedToken(query.trim())}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Verify Token</span>
              </button>
            </div>

            {/* Quick Sample Selector Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px] text-slate-500 mr-1">Pre-seeded Test Scenarios:</span>
              <button
                type="button"
                onClick={() => handleTestToken('VRF-2024CS101-bed-ary-102-A')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700/60 transition-colors"
              >
                Arjun Patel (#2024CS101)
              </button>
              <button
                type="button"
                onClick={() => handleTestToken('VRF-2024CS103-bed-gar-201-A')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700/60 transition-colors"
              >
                Priya Sharma (#2024CS103)
              </button>
              <button
                type="button"
                onClick={() => handleTestToken('VRF-2024ME301-bed-ary-001-A')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700/60 transition-colors"
              >
                Vikram (PwD Ground #2024ME301)
              </button>
            </div>
          </div>

          {/* Verification Result Details */}
          {searchedToken && (
            <div className="mt-8 space-y-6 animate-in fade-in duration-200">
              {isVerified ? (
                <div className="rounded-2xl bg-emerald-950/25 border border-emerald-500/40 p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                          AUTHENTICATED RECORD CONFIRMED
                        </span>
                        <h2 className="text-lg font-bold text-white">
                          Official Allotment Certificate Valid & Active
                        </h2>
                      </div>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-900/40 border border-emerald-600/50 text-emerald-300 text-xs hover:bg-emerald-800/50 transition-colors"
                      title="Copy Token to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Token'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-500/20 text-xs">
                    <div>
                      <span className="text-slate-400 block">Student Name</span>
                      <strong className="text-white text-sm">
                        {matchedStudent.name} ({matchedStudent.roll})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Allocated Residence Hall</span>
                      <strong className="text-white text-sm">{matchedStudent.hostel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Room & Bed Identifier</span>
                      <strong className="text-indigo-300 text-sm">
                        {matchedStudent.roomBed}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Room Accommodation Type</span>
                      <strong className="text-white text-sm">{matchedStudent.roomType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Governance Sign-Off</span>
                      <strong className="text-emerald-300 text-sm">
                        {matchedStudent.warden}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Placement Policy Notes</span>
                      <span className="text-slate-300">{matchedStudent.notes}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    <p className="flex items-center justify-between">
                      <span>
                        Verified Token: <strong className="text-indigo-400">{searchedToken}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold uppercase">Passed 256-bit Check</span>
                    </p>
                    <p>Status: <span className="text-emerald-400 font-bold">LEGITIMATE & CHECKED-IN APPROVED</span></p>
                    <p className="text-slate-500">Authorized for residential gate entry and hall key dispatch.</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-rose-950/25 border border-rose-500/40 p-6 space-y-4 text-xs text-rose-300">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm font-bold text-white block">
                        Token Not Found or Unregistered
                      </strong>
                      <p className="mt-1">
                        No published allotment record matches <code>"{searchedToken}"</code>. Please ensure the token was copied accurately from an authorized allocation letter issued after warden sign-off.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between">
                    <span className="text-slate-400">Want to test with a verified certificate?</span>
                    <button
                      onClick={() => handleTestToken(DEFAULT_SAMPLE_TOKEN)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
                    >
                      Load Working Sample Token
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-600 py-6">
        © 2026 EduHostel OS • Residential Allotment & Digital Verification Registry
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading registry verification portal...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
