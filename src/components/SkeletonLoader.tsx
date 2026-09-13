'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-800/40 border border-slate-800 p-4 space-y-3">
            <div className="h-3 w-24 bg-slate-700/50 rounded" />
            <div className="h-7 w-16 bg-slate-700/70 rounded" />
            <div className="h-2.5 w-32 bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl bg-slate-800/40 border border-slate-800 p-6 space-y-4">
          <div className="h-4 w-40 bg-slate-700/50 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-28 bg-slate-800 rounded" />
                <div className="h-2.5 w-full bg-slate-800/70 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-64 rounded-2xl bg-slate-800/40 border border-slate-800 p-6 space-y-4">
          <div className="h-4 w-40 bg-slate-700/50 rounded" />
          <div className="h-24 bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const FloorMapSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 rounded-2xl bg-slate-800/40 border border-slate-800 p-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 rounded-xl bg-slate-800/40 border border-slate-800 p-4 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-slate-700/50 rounded" />
              <div className="h-4 w-16 bg-slate-700/40 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-16 rounded-lg bg-slate-800/70" />
              <div className="h-16 rounded-lg bg-slate-800/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-indigo-400">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {(actionText && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>{actionText}</span>
            </a>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
