'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  const { hostels, activeDraft, auditLogs, overrides, approvals } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <AnalyticsDashboard
        hostels={hostels}
        activeDraft={activeDraft}
        auditLogs={auditLogs}
        overrides={overrides}
        approvals={approvals}
      />
    </div>
  );
}
