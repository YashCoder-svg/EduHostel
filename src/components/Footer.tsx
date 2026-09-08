import React from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, Shield, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#050811] text-slate-400 text-xs mt-20 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <p className="font-mono">P03 Policy-Driven Allocation Engine • Track J Architecture</p>
        </div>
      </div>
    </footer>
  );
};
