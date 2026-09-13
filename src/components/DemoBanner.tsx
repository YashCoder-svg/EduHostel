'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(true); // Default to true before client check to avoid hydration flash

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('eduhostel_demo_banner_dismissed');
      setDismissed(isDismissed === 'true');
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('eduhostel_demo_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleRestore = () => {
    setDismissed(false);
    try {
      localStorage.removeItem('eduhostel_demo_banner_dismissed');
    } catch {
      // ignore
    }
  };

  if (dismissed) {
    return (
      <aside aria-label="Demo Mode Indicator" className="fixed bottom-3 left-3 z-40 print:hidden">
        <button
          onClick={handleRestore}
          className="group flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 shadow-lg backdrop-blur-md transition-all hover:scale-105"
          title="Click to view Demo Mode information"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>Demo Mode</span>
          <Info className="w-3 h-3 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Demo Mode Alert" className="relative z-40 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-slate-200 border-b border-indigo-500/30 text-xs py-2 px-4 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3 h-3" />
          </span>
          <p className="text-[11px] sm:text-xs truncate sm:whitespace-normal">
            <span className="font-bold text-indigo-300">Demo Mode</span>
            <span className="mx-1.5 text-slate-500">|</span>
            <span>Seeded sample data, no real students. Auth disabled for evaluation.</span>
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Dismiss Demo Mode banner"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
