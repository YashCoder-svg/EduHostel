import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Hostel,
  AllocationDraft,
  AllocationAssignment,
  User,
  Bed,
  Room,
} from '@/types';
import {
  Layers,
  BedDouble,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRightLeft,
  Lock,
  Building,
  Sparkles,
  Users,
  Check,
  X,
  VolumeX,
  Accessibility,
  Move,
  MapPin,
} from 'lucide-react';
import { FloorMapSkeleton, EmptyState } from '@/components/SkeletonLoader';

interface VisualBedMapProps {
  hostels: Hostel[];
  activeDraft?: AllocationDraft;
  currentUser: User;
  onOverrideAssignment: (
    assignmentId: string,
    newBedId: string,
    mandatoryReason: string
  ) => Promise<{ success: boolean; error?: string }>;
  onApproveDraft: (notes: string) => Promise<{ success: boolean; error?: string }>;
  onPublishDraft: () => Promise<{ success: boolean; error?: string }>;
}

export const VisualBedMap: React.FC<VisualBedMapProps> = ({
  hostels,
  activeDraft,
  currentUser,
  onOverrideAssignment,
  onApproveDraft,
  onPublishDraft,
}) => {
  const [selectedHostelId, setSelectedHostelId] = useState<string>(
    currentUser.assignedHostelId || hostels[0]?.id || ''
  );
  const selectedHostel = hostels.find((h) => h.id === selectedHostelId) || hostels[0];
  const allFloors = selectedHostel?.blocks?.[0]?.floors || [];
  const [selectedFloorNum, setSelectedFloorNum] = useState<number>(0);

  const currentFloor = allFloors.find((f) => f.floorNumber === selectedFloorNum) || allFloors[0];

  // Reassignment Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AllocationAssignment | null>(null);
  const [targetBedId, setTargetBedId] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overrideError, setOverrideError] = useState<string>('');
  const [overrideSuccess, setOverrideSuccess] = useState<string>('');

  // Drag and Drop State
  const [draggingAssignment, setDraggingAssignment] = useState<AllocationAssignment | null>(null);
  const [dragOverBedId, setDragOverBedId] = useState<string | null>(null);

  // Approval Modal State
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState(
    'Hostel floor inventory, PwD ground-floor rules, and compatibility matches thoroughly reviewed.'
  );

  // Publish Status Alert State
  const [publishAlert, setPublishAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  // Map of bedId -> Assignment
  const assignmentByBedId = new Map<string, AllocationAssignment>();
  if (activeDraft) {
    for (const a of activeDraft.assignments) {
      assignmentByBedId.set(a.bedId, a);
    }
  }

  // Find all available vacant beds in current hostel
  const vacantBedsInHostel: { bed: Bed; room: Room }[] = [];
  if (selectedHostel) {
    for (const block of selectedHostel.blocks) {
      for (const floor of block.floors) {
        for (const room of floor.rooms) {
          for (const bed of room.beds) {
            if (!assignmentByBedId.has(bed.id)) {
              vacantBedsInHostel.push({ bed, room });
            }
          }
        }
      }
    }
  }

  const handleOpenReassign = (assignment: AllocationAssignment, preselectedBedId?: string) => {
    setSelectedAssignment(assignment);
    setTargetBedId(preselectedBedId || vacantBedsInHostel[0]?.bed.id || '');
    setOverrideReason('');
    setOverrideError('');
    setOverrideSuccess('');
    setReassignModalOpen(true);
  };

  const handleExecuteReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!overrideReason || overrideReason.trim().length < 5) {
      setOverrideError('Mandatory Reason is legally required (minimum 5 characters).');
      return;
    }
    if (!targetBedId) {
      setOverrideError('Please select a target vacant bed.');
      return;
    }

    const res = await onOverrideAssignment(
      selectedAssignment.id,
      targetBedId,
      overrideReason.trim()
    );

    if (!res.success) {
      setOverrideError(res.error || 'Failed to reassign bed');
    } else {
      setOverrideSuccess('Reassignment completed and audit trail logged.');
      setTimeout(() => {
        setReassignModalOpen(false);
        setOverrideSuccess('');
      }, 1500);
    }
  };

  const handleExecutePublish = async () => {
    setPublishAlert(null);
    const res = await onPublishDraft();
    if (!res.success) {
      setPublishAlert({
        type: 'error',
        msg: res.error || 'Cannot publish allocation without warden approval.',
      });
    } else {
      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setPublishAlert({
        type: 'success',
        msg: 'Allocation draft has been officially approved and published! Official letters and check-in active.',
      });
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (assignment: AllocationAssignment) => {
    setDraggingAssignment(assignment);
  };

  const handleDropOnBed = (destBedId: string) => {
    if (draggingAssignment && destBedId !== draggingAssignment.bedId) {
      handleOpenReassign(draggingAssignment, destBedId);
    }
    setDraggingAssignment(null);
    setDragOverBedId(null);
  };

  if (hostels.length === 0) {
    return (
      <div className="max-w-7xl mx-auto pb-12 space-y-6">
        <FloorMapSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header with Warden Controls & Governance Sign-off */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                <span>Warden Visual Bed Map & Draft Review</span>
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                Module M7
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Floor-by-floor spatial layout with <strong>drag-and-drop reassignment</strong>, roommate match breakdown, and strict warden governance sign-off.
            </p>
          </div>

          {/* Governance Actions Box */}
          <div className="flex flex-wrap items-center gap-2.5">
            {activeDraft?.status === 'DRAFT' && (
              <button
                id="warden-approve-draft-btn"
                onClick={() => setApproveModalOpen(true)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign & Approve Draft</span>
              </button>
            )}

            {activeDraft?.status === 'APPROVED' && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Warden Sign-Off Recorded ({activeDraft.approvedBy})</span>
              </div>
            )}

            <button
              id="publish-allocation-btn"
              onClick={handleExecutePublish}
              disabled={activeDraft?.status === 'PUBLISHED'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg ${
                activeDraft?.status === 'PUBLISHED'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25 hover:scale-[1.02]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {activeDraft?.status === 'PUBLISHED'
                  ? 'Officially Published'
                  : 'Publish Final Allocation'}
              </span>
            </button>
          </div>
        </div>

        {/* Empty draft warning banner if no draft exists */}
        {!activeDraft && (
          <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>No allocation draft generated yet. Rooms currently reflect vacant unallocated status.</span>
            </div>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors self-start sm:self-auto shrink-0 shadow-sm"
            >
              Run Allocation Engine
            </Link>
          </div>
        )}

        {/* Governance feedback alert */}
        {publishAlert && (
          <div
            className={`mt-4 p-4 rounded-xl border flex items-start space-x-3 text-xs ${
              publishAlert.type === 'error'
                ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {publishAlert.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <strong className="font-semibold block">
                {publishAlert.type === 'error'
                  ? 'Strict Governance Constraint Enforced'
                  : 'Publication Confirmed'}
              </strong>
              <p className="mt-0.5">{publishAlert.msg}</p>
            </div>
            <button
              onClick={() => setPublishAlert(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drag-and-Drop Instruction Tip */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-indigo-300 flex items-center space-x-2">
          <Move className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Interactive Drag-to-Reassign:</strong> Click and drag any allocated student card directly onto a vacant bed slot to initiate an instant override!
          </span>
        </div>

        {/* Hostel and Floor Selectors */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">
              Hostel:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hostels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setSelectedHostelId(h.id);
                    setSelectedFloorNum(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedHostelId === h.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {h.name} ({h.genderPolicy})
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">
              Floor:
            </span>
            <div className="flex flex-wrap gap-1">
              {allFloors.map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => setSelectedFloorNum(fl.floorNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    selectedFloorNum === fl.floorNumber
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {fl.floorNumber === 0 && <Accessibility className="w-3.5 h-3.5 text-purple-300" />}
                  <span>{fl.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Floor Grid */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 pb-4 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>{selectedHostel?.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-300 font-normal">{currentFloor?.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Corridor view showing room capacity, student assignments, and vacancy slots.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/60" />
              <span className="text-slate-400">Vacant Bed (Drop Target)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400" />
              <span className="text-slate-400">Allocated Bed (Draggable)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400" />
              <span className="text-slate-400">Warden Overridden</span>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentFloor?.rooms.map((room) => {
            return (
              <div
                key={room.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 relative overflow-hidden transition-all hover:border-slate-700"
              >
                {/* Room Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold font-mono text-white">
                      Room {room.roomNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                      {room.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {room.isAccessible && (
                      <span
                        title="Wheelchair Accessible / Ground Floor"
                        className="p-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]"
                      >
                        <Accessibility className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {room.isQuietZone && (
                      <span
                        title="Quiet Study Zone"
                        className="p-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px]"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Beds in this Room */}
                <div className="mt-3 space-y-2.5">
                  {room.beds.map((bed) => {
                    const assignment = assignmentByBedId.get(bed.id);
                    const isDragOver = dragOverBedId === bed.id;

                    if (!assignment) {
                      return (
                        <div
                          key={bed.id}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverBedId(bed.id);
                          }}
                          onDragLeave={() => setDragOverBedId(null)}
                          onDrop={() => handleDropOnBed(bed.id)}
                          onClick={() => {
                            if (activeDraft?.assignments[0]) {
                              handleOpenReassign(activeDraft.assignments[0], bed.id);
                            }
                          }}
                          className={`p-3 rounded-lg border border-dashed transition-all flex items-center justify-between cursor-pointer ${
                            isDragOver
                              ? 'bg-indigo-600/30 border-indigo-400 scale-[1.02]'
                              : 'border-emerald-500/40 bg-emerald-950/10 hover:bg-emerald-950/20'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded bg-emerald-900/40 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center">
                              {bed.bedCode}
                            </span>
                            <span className="text-xs font-semibold text-emerald-400">
                              {isDragOver ? 'Drop Student Here!' : 'Vacant Bed Slot'}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-500/70 font-mono">
                            {isDragOver ? 'Release to Swap' : 'Drop Target'}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={bed.id}
                        draggable={true}
                        onDragStart={() => handleDragStart(assignment)}
                        className={`p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing hover:scale-[1.01] ${
                          assignment.isOverridden
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : 'bg-indigo-950/25 border-indigo-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded bg-indigo-900/60 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center border border-indigo-700/50">
                              {bed.bedCode}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-white block">
                                {assignment.studentName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{assignment.studentRoll}
                              </span>
                            </div>
                          </div>

                          <button
                            id={`reassign-bed-btn-${assignment.id}`}
                            onClick={() => handleOpenReassign(assignment)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1"
                            title="Reassign Bed (Mandatory Reason Required)"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Override</span>
                          </button>
                        </div>

                        {/* Roommate Match Score & Reason */}
                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center space-x-1 text-slate-300">
                            {assignment.compatibilityScore > 0 ? (
                              <span className="text-emerald-400 font-semibold">
                                {assignment.compatibilityScore}% Compatibility
                              </span>
                            ) : (
                              <span className="text-slate-400">Single Occupant</span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono">
                            Choice #{assignment.preferenceRankAchieved}
                          </span>
                        </div>

                        {assignment.isOverridden && (
                          <div className="mt-1.5 p-1.5 rounded bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-300">
                            <strong>Warden Override:</strong> {assignment.overrideReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Override / Reassignment Modal */}
      {reassignModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Warden Reassignment Override
                </h3>
              </div>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteReassign} className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block">Reassigning Student</span>
                <span className="text-sm font-bold text-white">
                  {selectedAssignment.studentName} ({selectedAssignment.studentRoll})
                </span>
                <span className="text-xs text-indigo-400 block mt-0.5">
                  Currently: {selectedAssignment.hostelName} Room {selectedAssignment.roomNumber} (Bed {selectedAssignment.bedCode})
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Vacant Bed
                </label>
                <select
                  value={targetBedId}
                  onChange={(e) => setTargetBedId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {vacantBedsInHostel.map(({ bed, room }) => (
                    <option key={bed.id} value={bed.id}>
                      Room {room.roomNumber} - Bed {bed.bedCode} ({room.type.replace('_', ' ')})
                      {room.isAccessible ? ' [Accessible]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mandatory Override Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="override-reason-textarea"
                  rows={3}
                  required
                  placeholder="e.g. Ground-floor transfer approved on recommendation of medical officer Dr. Roy."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Specification governance: Every manual override carries a mandatory audit reason stored permanently.
                </p>
              </div>

              {overrideError && (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300">
                  {overrideError}
                </div>
              )}

              {overrideSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300">
                  {overrideSuccess}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  id="submit-override-btn"
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                >
                  Commit Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warden Sign-off & Approval Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Formal Warden Draft Sign-Off
                </h3>
              </div>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              In accordance with institutional hostel governance, signing this draft certifies that all hard constraints (gender isolation, capacity, medical PwD ground-floor rules) have been inspected. Once approved, the draft may be officially published by the Chief Warden.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Warden Review Comments & Certification
              </label>
              <textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="confirm-warden-signoff-btn"
                onClick={async () => {
                  const res = await onApproveDraft(approvalNotes);
                  if (res.success) {
                    setApproveModalOpen(false);
                  }
                }}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25"
              >
                Sign & Authorize Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
