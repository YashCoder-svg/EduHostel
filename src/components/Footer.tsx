import React from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, Shield, ExternalLink, MapPin, Github, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#050811] text-slate-400 text-xs mt-20 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recruiter Case Study Card (< 200 words) */}
        <section aria-label="About This Project" className="mb-12 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-3 h-3" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  About This Project · Case Study
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>EduHostel OS</strong> replaces opaque spreadsheets with an auditable constraint-satisfaction engine. It guarantees strict institutional policy (gender separation, room capacity, PwD ground-floor accessibility) and optimizes roommate harmony via consented, encrypted lifestyle compatibility scoring (0–100%).
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="text-slate-500 font-semibold">Tech Stack:</span>
                {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Deterministic PRNG', 'QR Cryptography'].map(
                  (t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-indigo-300 font-mono text-[10px]"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2.5 w-full lg:w-auto">
              <a
                href="https://github.com/YashCoder-svg/EduHostel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Github className="w-4 h-4" />
                <span>View Source on GitHub</span>
                <ExternalLink className="w-3 h-3 text-indigo-200" />
              </a>
              <span className="text-[10px] text-slate-500 font-mono">MIT Licensed · Open Source</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Office */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-sm">EduHostel OS</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              EduHostel Residential Affairs & Housing System.<br />
              Office of the Dean of Student Welfare (DSW).<br />
              Hostel Management & Student Residence Secretariat.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus North Quadrangle, Admin Block-C</span>
            </div>
          </div>

          {/* Col 2: Residential Halls */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Residential Halls
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Aryabhatta Hall of Residence (Senior Men)</li>
              <li>Gargi Hall of Residence (Women)</li>
              <li>Kalam Research Tower (Scholars & PG)</li>
              <li>Sarojini Postgraduate Complex (Upcoming)</li>
            </ul>
          </div>

          {/* Col 3: Portal Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Quick Access
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/student" className="hover:text-indigo-300">
                  Student Application Portal ➔
                </Link>
              </li>
              <li>
                <Link href="/warden" className="hover:text-indigo-300">
                  Warden Bed Map & Review ➔
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-indigo-300">
                  QR Allotment Letter Verification ➔
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-indigo-300">
                  DSW Executive Analytics ➔
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Helplines */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Helpline & Assistance
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hostel Control Desk: +91 (011) 2659-1000</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>hostel.helpdesk@univ.edu</span>
              </p>
              <p className="flex items-center space-x-2 text-rose-400 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Anti-Ragging 24/7 Helpline: 1800-180-5522</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 EduHostel OS • Residential Housing Management System.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/YashCoder-svg/EduHostel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 hover:text-indigo-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <p className="font-mono">P03 Policy Engine</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
