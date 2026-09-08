'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StudentPortal } from '@/components/StudentPortal';
import { AllocationLetterModal } from '@/components/AllocationLetterModal';

export default function StudentPage() {
  const {
    currentUser,
    applications,
    hostels,
    activeDraft,
    saveStudentApplication,
    clearStudentEligibility,
    openLetterModal,
    closeLetterModal,
    letterModalAssignment,
  } = useApp();

  const currentStudentApp = applications.find((a) => a.studentId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <StudentPortal
        currentUser={currentUser}
        application={currentStudentApp}
        hostels={hostels}
        allApplications={applications}
        activeDraft={activeDraft}
        onSaveApplication={saveStudentApplication}
        onOpenLetterModal={openLetterModal}
        onClearStudentEligibility={clearStudentEligibility}
      />

      {/* Allocation Letter Modal */}
      {letterModalAssignment && (
        <AllocationLetterModal
          assignment={letterModalAssignment}
          onClose={closeLetterModal}
        />
      )}
    </div>
  );
}
