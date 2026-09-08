export type UserRole = 
  | 'STUDENT'
  | 'WARDEN'
  | 'CHIEF_WARDEN'
  | 'HOSTEL_ADMIN'
  | 'DSW'
  | 'SYS_ADMIN';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type RoomType = 'SINGLE_AC' | 'SINGLE_NON_AC' | 'DOUBLE_AC' | 'DOUBLE_NON_AC' | 'TRIPLE_NON_AC';
export type BedStatus = 'VACANT' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';
export type CycleStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ALLOCATING' | 'ALLOCATED' | 'PUBLISHED';
export type EligibilityStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING_REVIEW';
export type DraftStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  gender?: Gender;
  department?: string;
  year?: number;
  cgpa?: number;
  distanceKm?: number;
  feeCleared?: boolean;
  disciplinaryAction?: boolean;
  isPwD?: boolean;
  assignedHostelId?: string; // For wardens managing a specific hostel
  category?: 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'INTERNATIONAL';
}

export interface Bed {
  id: string;
  roomId: string;
  bedCode: string; // e.g. "A", "B", "C"
  status: BedStatus;
  currentStudentId?: string;
}

export interface Room {
  id: string;
  floorId: string;
  blockId: string;
  hostelId: string;
  roomNumber: string; // e.g. "101", "204"
  capacity: number;
  type: RoomType;
  isAccessible: boolean; // Ground floor / wheelchair ramp
  isQuietZone: boolean;
  hasAttachedBath: boolean;
  beds: Bed[];
}

export interface Floor {
  id: string;
  blockId: string;
  hostelId: string;
  floorNumber: number; // 0 = Ground Floor, 1 = 1st, etc.
  name: string;
  hasElevator: boolean;
  hasRamp: boolean;
  rooms: Room[];
}

export interface Block {
  id: string;
  hostelId: string;
  name: string; // e.g. "A Block", "North Wing"
  genderPolicy: Gender;
  floors: Floor[];
}

export interface Hostel {
  id: string;
  name: string;
  code: string; // e.g. "HIM", "SAR", "KAL"
  genderPolicy: Gender;
  description: string;
  amenities: string[];
  totalCapacity: number;
  currentOccupancy: number;
  blocks: Block[];
}

export interface EligibilityRule {
  id: string;
  name: string;
  field: 'cgpa' | 'feeCleared' | 'distanceKm' | 'disciplinaryAction' | 'year';
  operator: '>=' | '<=' | '==' | '!=' | '>';
  value: any;
  mandatory: boolean;
  rejectionReason: string;
}

export interface AllocationCycle {
  id: string;
  academicYear: string; // e.g. "2026-2027"
  semester: 'ODD' | 'EVEN' | 'SUMMER';
  startDate: string;
  endDate: string;
  status: CycleStatus;
  eligibleGenders: Gender[];
  totalApplications: number;
  allocatedCount: number;
  activeDraftId?: string;
  publishedDraftId?: string;
}

export interface LifestyleQuestionnaire {
  sleepSchedule: 1 | 2 | 3 | 4 | 5; // 1: Extreme early bird (5 AM - 10 PM), 5: Extreme night owl (3 AM - 11 AM)
  studyHabit: 1 | 2 | 3 | 4 | 5; // 1: Complete silence/desk only, 5: Music/group discussions in room
  cleanliness: 1 | 2 | 3 | 4 | 5; // 1: Casual/relaxed, 5: Spotless/daily disinfectant
  guestFrequency: 1 | 2 | 3 | 4 | 5; // 1: No visitors allowed, 5: Frequent friends/study groups
  temperatureComfort: 1 | 2 | 3 | 4 | 5; // 1: Chilled AC (18C), 5: Natural breeze/no AC/warm
  foodHabit: 'VEG' | 'NON_VEG' | 'ANY';
}

export interface EncryptedLifestyleData {
  encryptedPayload: string; // Encrypted string for data-at-rest privacy
  hash: string;
}

export interface StudentPreferences {
  rankedHostels: string[]; // Hostel IDs in ranked order
  preferredRoomTypes: RoomType[];
  preferredRoommates: string[]; // Roll numbers of preferred roommates
  requireAccessible: boolean;
  preferQuietZone: boolean;
}

export interface Application {
  id: string;
  cycleId: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  gender: Gender;
  isPwD: boolean;
  cgpa: number;
  distanceKm: number;
  feeCleared: boolean;
  category: 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'INTERNATIONAL';
  eligibilityStatus: EligibilityStatus;
  eligibilityReasons: string[];
  submissionDate: string;
  preferences: StudentPreferences;
  lifestyleEncrypted: EncryptedLifestyleData;
  lifestyleScores: LifestyleQuestionnaire; // In-memory runtime evaluation only, never exposed raw to other students
}

export interface AllocationAssignment {
  id: string;
  draftId: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  gender: Gender;
  hostelId: string;
  hostelName: string;
  roomId: string;
  roomNumber: string;
  floorNumber: number;
  bedId: string;
  bedCode: string;
  roomType: RoomType;
  preferenceRankAchieved: number; // 1 = 1st choice, 2 = 2nd choice, 99 = unranked fallback
  roommateRollNumbers: string[];
  compatibilityScore: number; // 0 - 100%
  explanation: string;
  assignedAt: string;
  isOverridden?: boolean;
  overrideReason?: string;
  overriddenBy?: string;
}

export interface AllocationDraft {
  id: string;
  cycleId: string;
  seed: string;
  version: number;
  status: DraftStatus;
  assignments: AllocationAssignment[];
  unassignedApplicationIds: string[];
  metrics: {
    totalRequested: number;
    totalAssigned: number;
    satisfactionRate: number; // % who received 1st or 2nd choice
    avgCompatibility: number;
    hardConstraintViolations: number;
    executionTimeMs: number;
  };
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalNotes?: string;
  publishedAt?: string;
}

export interface OverrideLog {
  id: string;
  draftId: string;
  assignmentId: string;
  studentId: string;
  studentRoll: string;
  wardenId: string;
  wardenName: string;
  oldBedId: string;
  oldRoomNumber: string;
  oldHostelName: string;
  newBedId: string;
  newRoomNumber: string;
  newHostelName: string;
  mandatoryReason: string;
  timestamp: string;
}

export interface WardenApproval {
  id: string;
  draftId: string;
  wardenId: string;
  wardenName: string;
  wardenRole: UserRole;
  action: 'APPROVED' | 'REJECTED';
  notes: string;
  timestamp: string;
  ipAddress: string;
}

export interface WaitlistEntry {
  id: string;
  cycleId: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  priorityScore: number;
  queuePosition: number;
  status: 'WAITING' | 'OFFERED' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
  ip: string;
}
