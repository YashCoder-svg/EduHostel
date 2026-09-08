'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { InventoryAdmin } from '@/components/InventoryAdmin';

export default function AdminPage() {
  const {
    hostels,
    cycles,
    activeDraft,
    currentUser,
    runAllocation,
    bulkImportRooms,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <InventoryAdmin
        hostels={hostels}
        cycles={cycles}
        activeDraft={activeDraft}
        currentUser={currentUser}
        onRunAllocation={runAllocation}
        onBulkImport={bulkImportRooms}
      />
    </div>
  );
}
