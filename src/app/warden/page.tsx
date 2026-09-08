'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { VisualBedMap } from '@/components/VisualBedMap';

export default function WardenPage() {
  const {
    hostels,
    activeDraft,
    currentUser,
    overrideAssignment,
    approveDraft,
    publishDraft,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <VisualBedMap
        hostels={hostels}
        activeDraft={activeDraft}
        currentUser={currentUser}
        onOverrideAssignment={overrideAssignment}
        onApproveDraft={approveDraft}
        onPublishDraft={publishDraft}
      />
    </div>
  );
}
