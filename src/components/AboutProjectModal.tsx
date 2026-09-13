'use client';

import React from 'react';
import { X, Building2, CheckCircle2, ShieldCheck, Github, ExternalLink, Cpu } from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 text-xs text-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">About EduHostel OS</h2>
              <p className="text-[11px] text-indigo-400">Institutional Allocation Engine & Case Study</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (< 200 words for recruiter skimming) */}
        <div className="space-y-3.5 leading-relaxed">
          <div>
            <h3 className="text-white font-semibold text-xs flex items-center space-x-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>The Problem</span>
            </h3>
            <p className="text-slate-400">
              Traditional university hostel allotment relies on manual spreadsheets, creating allocation delays, roommate conflict, and zero transparency for students.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs flex items-center space-x-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Constraint-Satisfaction Engine</span>
            </h3>
            <p className="text-slate-400">
              EduHostel automates room placement via a deterministic seed engine enforcing strict hard constraints (gender segregation, room capacity, PwD ground-floor priority) paired with lifestyle compatibility matching (sleep schedules, study habits).
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs flex items-center space-x-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Tech Stack</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Deterministic PRNG', 'AES Encryption', 'QR Verification'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-indigo-300"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <a
            href="https://github.com/YashCoder-svg/EduHostel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View Repository</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
