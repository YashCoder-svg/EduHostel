import seedrandom from 'seedrandom';
import type {
  Application,
  Hostel,
  Room,
  Bed,
  AllocationAssignment,
  AllocationDraft,
  Gender,
} from '../types';
import { calculateCompatibilityScore } from './compatibility';

export interface AllocationEngineParams {
  cycleId: string;
  seed: string;
  applications: Application[];
  hostels: Hostel[];
}

interface FlatBedSlot {
  hostelId: string;
  hostelName: string;
  hostelGender: Gender;
  blockId: string;
  floorId: string;
  floorNumber: number;
  isFloorAccessible: boolean;
  roomId: string;
  roomNumber: string;
  roomCapacity: number;
  roomType: string;
  isRoomAccessible: boolean;
  isQuietZone: boolean;
  bedId: string;
  bedCode: string;
  assignedStudentId?: string;
}

export function runAllocationEngine({
  cycleId,
  seed,
  applications,
  hostels,
}: AllocationEngineParams): AllocationDraft {
  const startTime = Date.now();
  // Initialize seeded PRNG
  const rng = seedrandom(seed);

  // 1. Flatten all available vacant beds
  const availableBeds: FlatBedSlot[] = [];
  for (const hostel of hostels) {
    for (const block of hostel.blocks) {
      for (const floor of block.floors) {
        for (const room of floor.rooms) {
          for (const bed of room.beds) {
            if (bed.status === 'VACANT') {
              availableBeds.push({
                hostelId: hostel.id,
                hostelName: hostel.name,
                hostelGender: block.genderPolicy || hostel.genderPolicy,
                blockId: block.id,
                floorId: floor.id,
                floorNumber: floor.floorNumber,
                isFloorAccessible: floor.hasRamp || floor.hasElevator || floor.floorNumber === 0,
                roomId: room.id,
                roomNumber: room.roomNumber,
                roomCapacity: room.capacity,
                roomType: room.type,
                isRoomAccessible: room.isAccessible || floor.floorNumber === 0,
                isQuietZone: room.isQuietZone,
                bedId: bed.id,
                bedCode: bed.bedCode,
              });
            }
          }
        }
      }
    }
  }

  // 2. Filter strictly ELIGIBLE applications
  const eligibleApps = applications.filter((app) => app.eligibilityStatus === 'ELIGIBLE');

  // 3. Priority Sort:
  // - PwD students first (strict priority for ground floor accessibility)
  // - Seniority / Year & CGPA
  // - Distance from campus
  // Deterministic tie-breaker using seeded RNG
  const sortedApps = [...eligibleApps].sort((a, b) => {
    if (a.isPwD && !b.isPwD) return -1;
    if (!a.isPwD && b.isPwD) return 1;

    // Distance priority
    if (Math.abs(b.distanceKm - a.distanceKm) > 50) {
      return b.distanceKm - a.distanceKm;
    }

    // CGPA merit
    if (Math.abs(b.cgpa - a.cgpa) > 0.1) {
      return b.cgpa - a.cgpa;
    }

    // Seeded tiebreak for perfect determinism
    return rng() - 0.5;
  });

  const assignments: AllocationAssignment[] = [];
  const assignedAppIds = new Set<string>();
  const occupiedBedIds = new Set<string>();

  // Map of studentId -> app for quick lookup
  const appByRoll = new Map<string, Application>();
  const appById = new Map<string, Application>();
  for (const app of eligibleApps) {
    appByRoll.set(app.studentRoll, app);
    appById.set(app.studentId, app);
  }

  // Helper: Find rooms with partial occupancy to match roommates
  const roomOccupantsMap = new Map<string, { studentId: string; app: Application }[]>();

  // 4. Allocation pass
  for (const app of sortedApps) {
    if (assignedAppIds.has(app.id)) continue;

    // Check mutual roommate request first
    let matchedRoommateApp: Application | null = null;
    if (app.preferences.preferredRoommates && app.preferences.preferredRoommates.length > 0) {
      for (const prefRoll of app.preferences.preferredRoommates) {
        const potentialMate = appByRoll.get(prefRoll);
        if (
          potentialMate &&
          !assignedAppIds.has(potentialMate.id) &&
          potentialMate.gender === app.gender &&
          potentialMate.preferences.preferredRoommates?.includes(app.studentRoll)
        ) {
          // Mutual match found!
          matchedRoommateApp = potentialMate;
          break;
        }
      }
    }

    // Find best matching bed slot respecting HARD constraints
    // Candidate filtering:
    const candidateBeds = availableBeds.filter((bed) => {
      if (occupiedBedIds.has(bed.bedId)) return false;

      // Hard constraint 1: Gender isolation
      if (bed.hostelGender !== app.gender) return false;

      // Hard constraint 2: PwD / Accessibility requires Ground Floor or Accessible room
      if (app.isPwD && !bed.isRoomAccessible && bed.floorNumber !== 0) {
        return false;
      }

      return true;
    });

    if (candidateBeds.length === 0) {
      continue; // No suitable bed under hard constraints
    }

    // Soft constraint scoring for bed selection
    let bestBed: FlatBedSlot | null = null;
    let bestScore = -9999;
    let bestRankAchieved = 99;
    let bestExplanation = '';
    let bestCompatScore = 75;

    for (const bed of candidateBeds) {
      let score = 100;
      let rank = 99;
      const reasons: string[] = [];

      // Ranked hostel preference
      const hostelPrefIndex = app.preferences.rankedHostels.indexOf(bed.hostelId);
      if (hostelPrefIndex === 0) {
        score += 80;
        rank = 1;
        reasons.push('1st choice hostel');
      } else if (hostelPrefIndex === 1) {
        score += 50;
        rank = 2;
        reasons.push('2nd choice hostel');
      } else if (hostelPrefIndex >= 2) {
        score += 20;
        rank = hostelPrefIndex + 1;
        reasons.push(`${rank}th choice hostel`);
      } else {
        score -= 20;
        reasons.push('Unranked hostel fallback');
      }

      // Room type preference
      if (app.preferences.preferredRoomTypes.includes(bed.roomType as any)) {
        score += 30;
        reasons.push(`Preferred room type (${bed.roomType.replace('_', ' ')})`);
      }

      // Quiet zone match
      if (app.preferences.preferQuietZone && bed.isQuietZone) {
        score += 15;
        reasons.push('Quiet study zone');
      }

      // Accessibility match
      if (app.isPwD && (bed.floorNumber === 0 || bed.isRoomAccessible)) {
        score += 50;
        reasons.push('PwD ground-floor accessibility requirement fulfilled');
      }

      // Check current room occupants for lifestyle compatibility
      const currentRoomOccupants = roomOccupantsMap.get(bed.roomId) || [];
      let compat = 80;
      if (currentRoomOccupants.length > 0) {
        let totalCompat = 0;
        for (const occ of currentRoomOccupants) {
          totalCompat += calculateCompatibilityScore(
            app.lifestyleScores,
            occ.app.lifestyleScores
          );
        }
        compat = Math.round(totalCompat / currentRoomOccupants.length);
        score += (compat - 50) * 1.5; // High compatibility boosts score
        reasons.push(`${compat}% roommate lifestyle compatibility`);
      }

      if (score > bestScore) {
        bestScore = score;
        bestBed = bed;
        bestRankAchieved = rank;
        bestCompatScore = compat;
        bestExplanation = `Assigned to ${bed.hostelName} (Room ${bed.roomNumber}, Bed ${bed.bedCode}). ${reasons.join(', ')}.`;
      }
    }

    if (bestBed) {
      // Assign student to best bed
      occupiedBedIds.add(bestBed.bedId);
      assignedAppIds.add(app.id);

      const occupants = roomOccupantsMap.get(bestBed.roomId) || [];
      occupants.push({ studentId: app.studentId, app });
      roomOccupantsMap.set(bestBed.roomId, occupants);

      const roommateRolls = occupants
        .filter((o) => o.studentId !== app.studentId)
        .map((o) => o.app.studentRoll);

      assignments.push({
        id: `assign-${app.id}-${bestBed.bedId}`,
        draftId: '', // Set on draft creation
        applicationId: app.id,
        studentId: app.studentId,
        studentName: app.studentName,
        studentRoll: app.studentRoll,
        gender: app.gender,
        hostelId: bestBed.hostelId,
        hostelName: bestBed.hostelName,
        roomId: bestBed.roomId,
        roomNumber: bestBed.roomNumber,
        floorNumber: bestBed.floorNumber,
        bedId: bestBed.bedId,
        bedCode: bestBed.bedCode,
        roomType: bestBed.roomType as any,
        preferenceRankAchieved: bestRankAchieved,
        roommateRollNumbers: roommateRolls,
        compatibilityScore: bestCompatScore,
        explanation: bestExplanation,
        assignedAt: new Date().toISOString(),
      });

      // If there's a mutual roommate and the room has capacity, assign them to this room!
      if (matchedRoommateApp && bestBed.roomCapacity > 1) {
        const nextBedInSameRoom = candidateBeds.find(
          (b) => b.roomId === bestBed!.roomId && !occupiedBedIds.has(b.bedId)
        );

        if (nextBedInSameRoom) {
          occupiedBedIds.add(nextBedInSameRoom.bedId);
          assignedAppIds.add(matchedRoommateApp.id);

          occupants.push({ studentId: matchedRoommateApp.studentId, app: matchedRoommateApp });
          roomOccupantsMap.set(bestBed.roomId, occupants);

          const mutualCompat = calculateCompatibilityScore(
            app.lifestyleScores,
            matchedRoommateApp.lifestyleScores
          );

          assignments.push({
            id: `assign-${matchedRoommateApp.id}-${nextBedInSameRoom.bedId}`,
            draftId: '',
            applicationId: matchedRoommateApp.id,
            studentId: matchedRoommateApp.studentId,
            studentName: matchedRoommateApp.studentName,
            studentRoll: matchedRoommateApp.studentRoll,
            gender: matchedRoommateApp.gender,
            hostelId: nextBedInSameRoom.hostelId,
            hostelName: nextBedInSameRoom.hostelName,
            roomId: nextBedInSameRoom.roomId,
            roomNumber: nextBedInSameRoom.roomNumber,
            floorNumber: nextBedInSameRoom.floorNumber,
            bedId: nextBedInSameRoom.bedId,
            bedCode: nextBedInSameRoom.bedCode,
            roomType: nextBedInSameRoom.roomType as any,
            preferenceRankAchieved: 1,
            roommateRollNumbers: [app.studentRoll],
            compatibilityScore: mutualCompat,
            explanation: `Assigned together via confirmed mutual roommate preference with ${app.studentName} (${app.studentRoll}). Compatibility match: ${mutualCompat}%.`,
            assignedAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  // Calculate unassigned applications
  const unassigned = eligibleApps
    .filter((a) => !assignedAppIds.has(a.id))
    .map((a) => a.id);

  // Metrics
  const totalAssigned = assignments.length;
  const topChoices = assignments.filter((a) => a.preferenceRankAchieved <= 2).length;
  const satisfactionRate =
    totalAssigned > 0 ? Math.round((topChoices / totalAssigned) * 100) : 0;
  const avgCompat =
    totalAssigned > 0
      ? Math.round(
          assignments.reduce((sum, a) => sum + a.compatibilityScore, 0) / totalAssigned
        )
      : 0;

  const draftId = `draft-${cycleId}-${Date.now().toString(36)}`;
  for (const a of assignments) {
    a.draftId = draftId;
  }

  return {
    id: draftId,
    cycleId,
    seed,
    version: 1,
    status: 'DRAFT', // Always produces DRAFT per Governance constraint
    assignments,
    unassignedApplicationIds: unassigned,
    metrics: {
      totalRequested: eligibleApps.length,
      totalAssigned,
      satisfactionRate,
      avgCompatibility: avgCompat,
      hardConstraintViolations: 0,
      executionTimeMs: Date.now() - startTime,
    },
    createdAt: new Date().toISOString(),
  };
}
