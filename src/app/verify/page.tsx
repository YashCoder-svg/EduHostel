'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, Building2, QrCode, ArrowLeft, Search } from 'lucide-react';
import { INITIAL_USERS, generateInitialHostels } from '@/lib/storage';

function VerificationContent() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  const [query, setQuery] = useState(initialToken);
  const [searchedToken, setSearchedToken] = useState(initialToken);

  // Mock lookup
  const isVerified = searchedToken.length > 5 && (searchedToken.includes('2024') || searchedToken.startsWith('VRF-'));

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Navigation Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Hostel OS Dashboard</span>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
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
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LIVE DIGITAL REGISTRY
            </span>
          </div>

          {/* Search bar */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Enter Verification Token or Student Roll Number
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. VRF-2024CS101-bed-ary-102-A or 2024CS101"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => setSearchedToken(query)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>
          </div>

          {/* Verification Result Details */}
          {searchedToken && (
            <div className="mt-8 space-y-6">
              {isVerified ? (
                <div className="rounded-2xl bg-emerald-950/25 border border-emerald-500/40 p-6 space-y-5">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-500/20 text-xs">
                    <div>
                      <span className="text-slate-400 block">Student Name</span>
                      <strong className="text-white text-sm">Arjun Patel (2024CS101)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Allocated Residence</span>
                      <strong className="text-white text-sm">Aryabhatta Hall of Residence</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Room & Bed Identifier</span>
                      <strong className="text-indigo-300 text-sm">Room 001, Bed A (Ground Floor)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Governance Sign-Off</span>
                      <strong className="text-emerald-300 text-sm">Certified by Dr. S. Sharma (Warden)</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    <p>Verified Token: <span className="text-indigo-400">{searchedToken}</span></p>
                    <p>Status: <span className="text-emerald-400 font-bold">LEGITIMATE & CHECKED-IN APPROVED</span></p>
                    <p>Authorized for gate entry and hall key dispatch.</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-rose-950/25 border border-rose-500/40 p-6 flex items-start space-x-3 text-xs text-rose-300">
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-white block">
                      Token Not Found or Unregistered
                    </strong>
                    <p className="mt-1">
                      No published allotment record matches this token. Please ensure the token was copied accurately from an authorized allocation letter issued after warden sign-off.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-600 py-4">
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
