'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Hostel,
  AllocationCycle,
  AllocationDraft,
  Application,
  AuditEntry,
  OverrideLog,
  WardenApproval,
  AllocationAssignment,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_CYCLE,
  generateInitialHostels,
  generateInitialApplications,
} from '@/lib/mock-data';
import { runAllocationEngine } from '@/lib/allocation-engine';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  hostels: Hostel[];
  cycles: AllocationCycle[];
  applications: Application[];
  activeDraft?: AllocationDraft;
  auditLogs: AuditEntry[];
  overrides: OverrideLog[];
  approvals: WardenApproval[];
  letterModalAssignment: AllocationAssignment | null;
  openLetterModal: (assignment: AllocationAssignment) => void;
  closeLetterModal: () => void;
  saveStudentApplication: (preferences: any, lifestyle: any) => void;
  clearStudentEligibility: (studentId: string, reason: string) => void;
  runAllocation: (seed: string) => Promise<{ success: boolean; draft?: AllocationDraft; error?: string }>;
  overrideAssignment: (
    assignmentId: string,
    newBedId: string,
    mandatoryReason: string
  ) => Promise<{ success: boolean; error?: string }>;
  approveDraft: (notes: string) => Promise<{ success: boolean; error?: string }>;
  publishDraft: () => Promise<{ success: boolean; error?: string }>;
  bulkImportRooms: (hostelId: string, blockId: string, floorNumber: number, roomsData: any[]) => Promise<number>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Starts as Arjun Patel
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [cycles, setCycles] = useState<AllocationCycle[]>([INITIAL_CYCLE]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeDraft, setActiveDraft] = useState<AllocationDraft | undefined>(undefined);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [overrides, setOverrides] = useState<OverrideLog[]>([]);
  const [approvals, setApprovals] = useState<WardenApproval[]>([]);
  const [letterModalAssignment, setLetterModalAssignment] = useState<AllocationAssignment | null>(null);

  useEffect(() => {
    const initialHostels = generateInitialHostels();
    const initialApps = generateInitialApplications();
    setHostels(initialHostels);
    setApplications(initialApps);

    // Initial draft generated from seed
    const draft = runAllocationEngine({
      cycleId: INITIAL_CYCLE.id,
      seed: 'SEED_CAMPUS_2026_DEFAULT',
      applications: initialApps,
      hostels: initialHostels,
    });
    setActiveDraft(draft);

    setAuditLogs([
      {
        id: 'audit-001',
        actorId: 'user-sys-admin',
        actorName: 'System Administrator',
        actorRole: 'SYS_ADMIN',
        action: 'CYCLE_INITIALIZED',
        entityType: 'AllocationCycle',
        entityId: INITIAL_CYCLE.id,
        details: 'Cycle 2026-2027 Odd Semester initialized with 3 halls of residence.',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      {
        id: 'audit-002',
        actorId: 'user-hostel-admin',
        actorName: 'Admin Verma',
        actorRole: 'HOSTEL_ADMIN',
        action: 'DRAFT_GENERATED',
        entityType: 'AllocationDraft',
        entityId: draft.id,
        details: `Generated initial draft from seed "${draft.seed}". Processed ${draft.metrics.totalRequested} applications.`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
    ]);
  }, []);

  const openLetterModal = (assignment: AllocationAssignment) => setLetterModalAssignment(assignment);
  const closeLetterModal = () => setLetterModalAssignment(null);

  const saveStudentApplication = (preferences: any, lifestyle: any) => {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.studentId === currentUser.id);
      const isElig =
        currentUser.feeCleared && (currentUser.cgpa ?? 0) >= 5.0 && !currentUser.disciplinaryAction;

      const updatedApp: Application = {
        id: idx >= 0 ? prev[idx].id : `app-${Date.now()}`,
        cycleId: cycles[0].id,
        studentId: currentUser.id,
        studentRoll: currentUser.rollNumber || 'UNKNOWN',
        studentName: currentUser.name,
        gender: currentUser.gender || 'MALE',
        isPwD: !!currentUser.isPwD,
        cgpa: currentUser.cgpa || 7.0,
        distanceKm: currentUser.distanceKm || 100,
        feeCleared: !!currentUser.feeCleared,
        category: currentUser.category || 'GENERAL',
        eligibilityStatus: isElig ? 'ELIGIBLE' : 'INELIGIBLE',
        eligibilityReasons: isElig
          ? ['Passed all residential criteria (Fee Cleared, CGPA >= 5.0, Distance >= 25km)']
          : ['Outstanding policy hold pending proctorial / finance clearance'],
        submissionDate: new Date().toISOString(),
        preferences,
        lifestyleScores: lifestyle,
        lifestyleEncrypted: {
          encryptedPayload: 'ENC:SENSITIVE_LIFESTYLE_CIPHER',
          hash: 'a9f0',
        },
      };

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedApp;
        return next;
      }
      return [...prev, updatedApp];
    });

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'PREFERENCES_UPDATED',
        entityType: 'Application',
        entityId: currentUser.id,
        details: 'Submitted updated hostel choices and encrypted lifestyle questionnaire.',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);
  };

  const clearStudentEligibility = (studentId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.studentId === studentId
          ? {
              ...a,
              eligibilityStatus: 'ELIGIBLE',
              eligibilityReasons: [`Provisional clearance granted on appeal: "${reason}"`],
            }
          : a
      )
    );
    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'STUDENT_APPEAL_CLEARED',
        entityType: 'Application',
        entityId: studentId,
        details: `Provisional clearance approved: "${reason}"`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);
  };

  const runAllocation = async (seed: string) => {
    const draft = runAllocationEngine({
      cycleId: cycles[0].id,
      seed,
      applications,
      hostels,
    });

    setActiveDraft(draft);
    setCycles((prev) => [{ ...prev[0], activeDraftId: draft.id, status: 'ALLOCATED' }]);

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'ALLOCATION_ENGINE_RUN',
        entityType: 'AllocationDraft',
        entityId: draft.id,
        details: `Engine completed run with seed "${seed}". Total allocated: ${draft.assignments.length}.`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);

    return { success: true, draft };
  };

  const overrideAssignment = async (
    assignmentId: string,
    newBedId: string,
    mandatoryReason: string
  ) => {
    if (!activeDraft) return { success: false, error: 'No active draft' };
    if (!mandatoryReason || mandatoryReason.trim().length < 5) {
      return { success: false, error: 'Mandatory reason must be documented (min 5 characters).' };
    }

    let destBed: any = null;
    let destRoom: any = null;
    let destHostel: any = null;

    for (const h of hostels) {
      for (const b of h.blocks) {
        for (const f of b.floors) {
          for (const r of f.rooms) {
            for (const bed of r.beds) {
              if (bed.id === newBedId) {
                destBed = bed;
                destRoom = r;
                destHostel = h;
                break;
              }
            }
          }
        }
      }
    }

    if (!destBed) return { success: false, error: 'Selected destination bed does not exist' };

    const assignment = activeDraft.assignments.find((a) => a.id === assignmentId);
    if (!assignment) return { success: false, error: 'Assignment not found' };

    if (destHostel.genderPolicy !== assignment.gender) {
      return {
        success: false,
        error: `Hard Constraint Violation: Student (${assignment.gender}) cannot be placed in ${destHostel.genderPolicy} hostel.`,
      };
    }

    const updatedAssignments = activeDraft.assignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          bedId: destBed.id,
          bedCode: destBed.bedCode,
          roomId: destRoom.id,
          roomNumber: destRoom.roomNumber,
          floorNumber: destRoom.floorNumber || 0,
          hostelId: destHostel.id,
          hostelName: destHostel.name,
          isOverridden: true,
          overrideReason: mandatoryReason,
          overriddenBy: currentUser.name,
        };
      }
      return a;
    });

    setActiveDraft({
      ...activeDraft,
      assignments: updatedAssignments,
    });

    const newOverride: OverrideLog = {
      id: `ov-${Date.now()}`,
      draftId: activeDraft.id,
      assignmentId,
      studentId: assignment.studentId,
      studentRoll: assignment.studentRoll,
      wardenId: currentUser.id,
      wardenName: currentUser.name,
      oldBedId: assignment.bedId,
      oldRoomNumber: assignment.roomNumber,
      oldHostelName: assignment.hostelName,
      newBedId: destBed.id,
      newRoomNumber: destRoom.roomNumber,
      newHostelName: destHostel.name,
      mandatoryReason,
      timestamp: new Date().toISOString(),
    };

    setOverrides((prev) => [newOverride, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'WARDEN_OVERRIDE_APPLIED',
        entityType: 'AllocationAssignment',
        entityId: assignmentId,
        details: `Reassigned ${assignment.studentRoll} to ${destHostel.name} Room ${destRoom.roomNumber}. Reason: "${mandatoryReason}"`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);

    return { success: true };
  };

  const approveDraft = async (notes: string) => {
    if (!activeDraft) return { success: false, error: 'No active draft' };

    const approval: WardenApproval = {
      id: `appr-${Date.now()}`,
      draftId: activeDraft.id,
      wardenId: currentUser.id,
      wardenName: currentUser.name,
      wardenRole: currentUser.role,
      action: 'APPROVED',
      notes,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    };

    setApprovals((prev) => [approval, ...prev]);
    setActiveDraft({
      ...activeDraft,
      status: 'APPROVED',
      approvedBy: currentUser.name,
      approvedAt: approval.timestamp,
      approvalNotes: notes,
    });

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'WARDEN_DRAFT_APPROVED',
        entityType: 'AllocationDraft',
        entityId: activeDraft.id,
        details: `Draft certified by ${currentUser.name}. Notes: "${notes}"`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);

    return { success: true };
  };

  const publishDraft = async () => {
    if (!activeDraft) return { success: false, error: 'No active draft' };

    // STRICT GOVERNANCE CHECK
    const hasApproval = approvals.some((a) => a.draftId === activeDraft.id && a.action === 'APPROVED');
    if (!hasApproval && activeDraft.status !== 'APPROVED') {
      return {
        success: false,
        error:
          'GOVERNANCE CONSTRAINT VIOLATION: The engine strictly generates a DRAFT. Official publication requires a recorded Warden Approval sign-off. Please complete the warden review before publishing.',
      };
    }

    setActiveDraft({
      ...activeDraft,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    });

    setCycles((prev) => [{ ...prev[0], status: 'PUBLISHED' }]);

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'ALLOCATION_OFFICIALLY_PUBLISHED',
        entityType: 'AllocationDraft',
        entityId: activeDraft.id,
        details: `Official allocation published following sign-off by ${activeDraft.approvedBy || currentUser.name}. Letters and check-in active.`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);

    return { success: true };
  };

  const bulkImportRooms = async (
    hostelId: string,
    blockId: string,
    floorNumber: number,
    roomsData: any[]
  ) => {
    let addedCount = 0;
    setHostels((prev) => {
      const next = [...prev];
      const h = next.find((x) => x.id === hostelId);
      if (!h) return prev;
      const b = h.blocks.find((x) => x.id === blockId) || h.blocks[0];
      let f = b.floors.find((x) => x.floorNumber === floorNumber);
      if (!f) {
        f = {
          id: `floor-${blockId}-${floorNumber}`,
          blockId: b.id,
          hostelId: h.id,
          floorNumber,
          name: floorNumber === 0 ? 'Ground Floor' : `Floor ${floorNumber}`,
          hasElevator: true,
          hasRamp: floorNumber === 0,
          rooms: [],
        };
        b.floors.push(f);
      }

      for (const r of roomsData) {
        const existing = f.rooms.find((rm) => rm.roomNumber === r.roomNumber);
        if (!existing) {
          f.rooms.push({
            id: `room-${b.id}-${r.roomNumber}`,
            floorId: f.id,
            blockId: b.id,
            hostelId: h.id,
            roomNumber: r.roomNumber,
            capacity: r.capacity,
            type: r.type,
            isAccessible: r.isAccessible,
            isQuietZone: r.isQuietZone,
            hasAttachedBath: true,
            beds: Array.from({ length: r.capacity }, (_, i) => ({
              id: `bed-${b.id}-${r.roomNumber}-${String.fromCharCode(65 + i)}`,
              roomId: `room-${b.id}-${r.roomNumber}`,
              bedCode: String.fromCharCode(65 + i),
              status: 'VACANT',
            })),
          });
          addedCount++;
        }
      }
      return next;
    });

    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'INVENTORY_BULK_IMPORTED',
        entityType: 'Room',
        entityId: hostelId,
        details: `Imported ${addedCount} rooms into Floor ${floorNumber}.`,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      ...prev,
    ]);

    return addedCount;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        hostels,
        cycles,
        applications,
        activeDraft,
        auditLogs,
        overrides,
        approvals,
        letterModalAssignment,
        openLetterModal,
        closeLetterModal,
        saveStudentApplication,
        clearStudentEligibility,
        runAllocation,
        overrideAssignment,
        approveDraft,
        publishDraft,
        bulkImportRooms,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
