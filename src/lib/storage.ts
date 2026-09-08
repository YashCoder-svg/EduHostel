import type {
  AllocationCycle,
  AllocationDraft,
  Application,
  AuditEntry,
  Hostel,
  OverrideLog,
  User,
  WaitlistEntry,
  WardenApproval,
} from '../types';
import { encryptLifestyleData } from './encryption';
import { validateEligibility } from './eligibility';
import { runAllocationEngine } from './allocation-engine';
import {
  INITIAL_USERS,
  INITIAL_CYCLE,
  generateInitialHostels,
  generateInitialApplications,
} from './mock-data';

export {
  INITIAL_USERS,
  INITIAL_CYCLE,
  generateInitialHostels,
  generateInitialApplications,
};

// In-memory runtime state (singleton store)
class HostelDataStore {
  private users: User[] = INITIAL_USERS;
  private hostels: Hostel[] = generateInitialHostels();
  private cycles: AllocationCycle[] = [INITIAL_CYCLE];
  private applications: Application[] = generateInitialApplications();
  private drafts: AllocationDraft[] = [];
  private overrides: OverrideLog[] = [];
  private approvals: WardenApproval[] = [];
  private waitlist: WaitlistEntry[] = [];
  private auditLogs: AuditEntry[] = [
    {
      id: 'audit-init',
      actorId: 'user-sys-admin',
      actorName: 'System Administrator',
      actorRole: 'SYS_ADMIN',
      action: 'CYCLE_CREATED',
      entityType: 'AllocationCycle',
      entityId: 'cycle-2026-odd',
      details: 'Created academic cycle 2026-2027 Odd Semester',
      timestamp: '2026-08-01T10:00:00Z',
      ip: '192.168.1.1',
    },
  ];

  constructor() {
    // Lazy draft initialization on first access
  }

  private ensureInitialDraft(): void {
    if (this.drafts.length === 0) {
      const initialDraft = runAllocationEngine({
        cycleId: 'cycle-2026-odd',
        seed: 'SEED_2026_CAMPUS_PROD',
        applications: this.applications,
        hostels: this.hostels,
      });
      this.drafts.push(initialDraft);
      this.cycles[0].activeDraftId = initialDraft.id;
    }
  }

  // --- Users & Auth Simulation ---
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  // --- Hostels & Inventory ---
  getHostels(): Hostel[] {
    return this.hostels;
  }

  getHostelById(id: string): Hostel | undefined {
    return this.hostels.find((h) => h.id === id);
  }

  addHostel(hostel: Hostel): void {
    this.hostels.push(hostel);
  }

  updateBedStatus(bedId: string, status: 'VACANT' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE'): void {
    for (const h of this.hostels) {
      for (const b of h.blocks) {
        for (const f of b.floors) {
          for (const r of f.rooms) {
            for (const bed of r.beds) {
              if (bed.id === bedId) {
                bed.status = status;
                return;
              }
            }
          }
        }
      }
    }
  }

  // Bulk import rooms
  bulkImportRooms(
    hostelId: string,
    blockId: string,
    floorNumber: number,
    roomsData: { roomNumber: string; capacity: number; type: any; isAccessible: boolean; isQuietZone: boolean }[]
  ): number {
    const hostel = this.hostels.find((h) => h.id === hostelId);
    if (!hostel) return 0;
    const block = hostel.blocks.find((b) => b.id === blockId);
    if (!block) return 0;
    let floor = block.floors.find((f) => f.floorNumber === floorNumber);
    if (!floor) {
      floor = {
        id: `floor-${blockId}-${floorNumber}`,
        blockId,
        hostelId,
        floorNumber,
        name: floorNumber === 0 ? 'Ground Floor' : `Floor ${floorNumber}`,
        hasElevator: true,
        hasRamp: floorNumber === 0,
        rooms: [],
      };
      block.floors.push(floor);
    }

    let addedCount = 0;
    for (const r of roomsData) {
      const existing = floor.rooms.find((rm) => rm.roomNumber === r.roomNumber);
      if (!existing) {
        floor.rooms.push({
          id: `room-${blockId}-${r.roomNumber}`,
          floorId: floor.id,
          blockId,
          hostelId,
          roomNumber: r.roomNumber,
          capacity: r.capacity,
          type: r.type,
          isAccessible: r.isAccessible,
          isQuietZone: r.isQuietZone,
          hasAttachedBath: true,
          beds: Array.from({ length: r.capacity }, (_, i) => ({
            id: `bed-${blockId}-${r.roomNumber}-${String.fromCharCode(65 + i)}`,
            roomId: `room-${blockId}-${r.roomNumber}`,
            bedCode: String.fromCharCode(65 + i),
            status: 'VACANT',
          })),
        });
        addedCount++;
      }
    }
    return addedCount;
  }

  // --- Cycles & Applications ---
  getCycles(): AllocationCycle[] {
    return this.cycles;
  }

  getCycleById(id: string): AllocationCycle | undefined {
    return this.cycles.find((c) => c.id === id);
  }

  getApplications(): Application[] {
    return this.applications;
  }

  getApplicationByStudentId(studentId: string): Application | undefined {
    return this.applications.find((a) => a.studentId === studentId);
  }

  submitApplication(student: User, preferences: any, lifestyle: any): Application {
    const eligibility = validateEligibility(student);
    const existingIndex = this.applications.findIndex((a) => a.studentId === student.id);

    const app: Application = {
      id: existingIndex >= 0 ? this.applications[existingIndex].id : `app-${Date.now().toString(36)}`,
      cycleId: this.cycles[0].id,
      studentId: student.id,
      studentRoll: student.rollNumber || 'UNKNOWN',
      studentName: student.name,
      gender: student.gender || 'MALE',
      isPwD: !!student.isPwD,
      cgpa: student.cgpa || 7.0,
      distanceKm: student.distanceKm || 100,
      feeCleared: !!student.feeCleared,
      category: student.category || 'GENERAL',
      eligibilityStatus: eligibility.status,
      eligibilityReasons: eligibility.reasons,
      submissionDate: new Date().toISOString(),
      preferences,
      lifestyleScores: lifestyle,
      lifestyleEncrypted: encryptLifestyleData(lifestyle),
    };

    if (existingIndex >= 0) {
      this.applications[existingIndex] = app;
    } else {
      this.applications.push(app);
      this.cycles[0].totalApplications += 1;
    }

    this.addAuditLog({
      actorId: student.id,
      actorName: student.name,
      actorRole: 'STUDENT',
      action: 'APPLICATION_SUBMITTED',
      entityType: 'Application',
      entityId: app.id,
      details: `Submitted application with eligibility status: ${eligibility.status}`,
    });

    return app;
  }

  // --- Allocation Drafts ---
  getDrafts(): AllocationDraft[] {
    this.ensureInitialDraft();
    return this.drafts;
  }

  getDraftById(draftId: string): AllocationDraft | undefined {
    this.ensureInitialDraft();
    return this.drafts.find((d) => d.id === draftId);
  }

  getActiveDraft(): AllocationDraft | undefined {
    this.ensureInitialDraft();
    const activeId = this.cycles[0].activeDraftId;
    return this.drafts.find((d) => d.id === activeId) || this.drafts[this.drafts.length - 1];
  }

  runDraftAllocation(seed: string, actor: User): AllocationDraft {
    const draft = runAllocationEngine({
      cycleId: this.cycles[0].id,
      seed,
      applications: this.applications,
      hostels: this.hostels,
    });

    this.drafts.push(draft);
    this.cycles[0].activeDraftId = draft.id;
    this.cycles[0].allocatedCount = draft.assignments.length;

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'ALLOCATION_ENGINE_RUN',
      entityType: 'AllocationDraft',
      entityId: draft.id,
      details: `Generated draft from seed "${seed}". Total assigned: ${draft.assignments.length}`,
    });

    return draft;
  }

  // --- Warden Override Management ---
  reassignBedWithOverride({
    draftId,
    assignmentId,
    newBedId,
    warden,
    mandatoryReason,
  }: {
    draftId: string;
    assignmentId: string;
    newBedId: string;
    warden: User;
    mandatoryReason: string;
  }): { success: boolean; error?: string } {
    if (!mandatoryReason || mandatoryReason.trim().length < 5) {
      return { success: false, error: 'Mandatory reason (min 5 characters) must be documented for any warden override.' };
    }

    const draft = this.drafts.find((d) => d.id === draftId);
    if (!draft) return { success: false, error: 'Draft not found' };

    const assignment = draft.assignments.find((a) => a.id === assignmentId);
    if (!assignment) return { success: false, error: 'Assignment not found' };

    // Find destination bed
    let destBed: any = null;
    let destRoom: any = null;
    let destHostel: any = null;

    for (const h of this.hostels) {
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

    if (!destBed) return { success: false, error: 'Destination bed does not exist' };

    // Check if new bed is already assigned in draft
    const alreadyAssigned = draft.assignments.find((a) => a.bedId === newBedId && a.id !== assignmentId);
    if (alreadyAssigned) {
      return { success: false, error: `Bed ${destBed.bedCode} in Room ${destRoom.roomNumber} is already allocated to ${alreadyAssigned.studentName}.` };
    }

    // Gender check
    if (destHostel.genderPolicy !== assignment.gender) {
      return { success: false, error: `Hard Constraint Violation: Student gender (${assignment.gender}) does not match hostel policy (${destHostel.genderPolicy}).` };
    }

    const oldHostel = assignment.hostelName;
    const oldRoom = assignment.roomNumber;
    const oldBed = assignment.bedId;

    // Apply override
    assignment.bedId = destBed.id;
    assignment.bedCode = destBed.bedCode;
    assignment.roomId = destRoom.id;
    assignment.roomNumber = destRoom.roomNumber;
    assignment.floorNumber = destRoom.floorNumber || 0;
    assignment.hostelId = destHostel.id;
    assignment.hostelName = destHostel.name;
    assignment.isOverridden = true;
    assignment.overrideReason = mandatoryReason;
    assignment.overriddenBy = warden.name;

    const log: OverrideLog = {
      id: `override-${Date.now().toString(36)}`,
      draftId,
      assignmentId,
      studentId: assignment.studentId,
      studentRoll: assignment.studentRoll,
      wardenId: warden.id,
      wardenName: warden.name,
      oldBedId: oldBed,
      oldRoomNumber: oldRoom,
      oldHostelName: oldHostel,
      newBedId: destBed.id,
      newRoomNumber: destRoom.roomNumber,
      newHostelName: destHostel.name,
      mandatoryReason,
      timestamp: new Date().toISOString(),
    };

    this.overrides.push(log);

    this.addAuditLog({
      actorId: warden.id,
      actorName: warden.name,
      actorRole: warden.role,
      action: 'WARDEN_OVERRIDE_RECORDED',
      entityType: 'AllocationAssignment',
      entityId: assignment.id,
      details: `Reassigned ${assignment.studentName} to ${destHostel.name} Room ${destRoom.roomNumber}. Reason: "${mandatoryReason}"`,
    });

    return { success: true };
  }

  // --- Strict Warden Approval & Publication Governance ---
  recordWardenApproval({
    draftId,
    warden,
    action,
    notes,
  }: {
    draftId: string;
    warden: User;
    action: 'APPROVED' | 'REJECTED';
    notes: string;
  }): { success: boolean; error?: string } {
    const draft = this.drafts.find((d) => d.id === draftId);
    if (!draft) return { success: false, error: 'Draft not found' };

    const approval: WardenApproval = {
      id: `appr-${Date.now().toString(36)}`,
      draftId,
      wardenId: warden.id,
      wardenName: warden.name,
      wardenRole: warden.role,
      action,
      notes,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    };

    this.approvals.push(approval);
    draft.status = action === 'APPROVED' ? 'APPROVED' : 'REJECTED';
    draft.approvedBy = warden.name;
    draft.approvedAt = approval.timestamp;
    draft.approvalNotes = notes;

    this.addAuditLog({
      actorId: warden.id,
      actorName: warden.name,
      actorRole: warden.role,
      action: `WARDEN_DRAFT_${action}`,
      entityType: 'AllocationDraft',
      entityId: draft.id,
      details: `Warden review signed: ${action}. Notes: "${notes}"`,
    });

    return { success: true };
  }

  /**
   * CRITICAL GOVERNANCE CONSTRAINT:
   * "Build the draft/published state separation into the data model -
   * do not allow a code path that publishes an allocation without an approval record."
   */
  publishAllocation(draftId: string, actor: User): { success: boolean; error?: string } {
    const draft = this.drafts.find((d) => d.id === draftId);
    if (!draft) {
      return { success: false, error: 'Allocation draft not found.' };
    }

    // Strict validation: Must have recorded approval!
    const recordedApproval = this.approvals.find(
      (a) => a.draftId === draftId && a.action === 'APPROVED'
    );

    if (!recordedApproval) {
      return {
        success: false,
        error:
          'GOVERNANCE VIOLATION: Cannot publish allocation without recorded Warden Approval sign-off. Please complete warden review first.',
      };
    }

    draft.status = 'PUBLISHED';
    draft.publishedAt = new Date().toISOString();
    this.cycles[0].status = 'PUBLISHED';
    this.cycles[0].publishedDraftId = draft.id;

    // Update bed statuses to OCCUPIED in inventory
    for (const a of draft.assignments) {
      this.updateBedStatus(a.bedId, 'OCCUPIED');
    }

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'ALLOCATION_PUBLISHED',
      entityType: 'AllocationDraft',
      entityId: draft.id,
      details: `Official allocation published to students following sign-off by ${draft.approvedBy}.`,
    });

    return { success: true };
  }

  // --- Waiting List Management ---
  getWaitlist(): WaitlistEntry[] {
    return this.waitlist;
  }

  promoteWaitlist(entryId: string, actor: User): { success: boolean; error?: string } {
    const entry = this.waitlist.find((w) => w.id === entryId);
    if (!entry) return { success: false, error: 'Waitlist entry not found' };

    entry.status = 'OFFERED';
    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'WAITLIST_PROMOTED',
      entityType: 'WaitlistEntry',
      entityId: entry.id,
      details: `Offered vacancy to ${entry.studentName} (${entry.studentRoll})`,
    });

    return { success: true };
  }

  // --- Audit & Overrides ---
  getAuditLogs(): AuditEntry[] {
    return [...this.auditLogs].reverse();
  }

  getOverrides(): OverrideLog[] {
    return [...this.overrides].reverse();
  }

  getApprovals(): WardenApproval[] {
    return this.approvals;
  }

  addAuditLog(entry: Omit<AuditEntry, 'id' | 'timestamp' | 'ip'>): void {
    this.auditLogs.push({
      ...entry,
      id: `audit-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1',
    });
  }
}

// Export singleton instance
const globalForStore = globalThis as unknown as { hostelStore?: HostelDataStore };
export const hostelStore = globalForStore.hostelStore || new HostelDataStore();
if (process.env.NODE_ENV !== 'production') globalForStore.hostelStore = hostelStore;
