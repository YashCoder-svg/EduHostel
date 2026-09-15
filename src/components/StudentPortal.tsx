'use client';

import React, { useState } from 'react';
import {
  User,
  Application,
  Hostel,
  AllocationDraft,
  AllocationAssignment,
} from '@/types';
import {
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Send,
  X,
  Check,
} from 'lucide-react';

interface StudentPortalProps {
  currentUser: User;
  application?: Application;
  hostels: Hostel[];
  allApplications?: Application[];
  activeDraft?: AllocationDraft;
  onSaveApplication: (preferences: any, lifestyle: any) => void;
  onOpenLetterModal: (assignment: AllocationAssignment) => void;
  onClearStudentEligibility?: (studentId: string, reason: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  application,
  hostels,
  allApplications = [],
  activeDraft,
  onSaveApplication,
  onOpenLetterModal,
  onClearStudentEligibility,
}) => {
  const studentAssignment = activeDraft?.assignments.find(
    (a) => a.studentId === currentUser.id
  );
  const isPublished = activeDraft?.status === 'PUBLISHED';

  const [activeStep, setActiveStep] = useState<
    'preferences' | 'questionnaire' | 'matchmaker' | 'roomswap'
  >('preferences');

  const [rankedHostels, setRankedHostels] = useState<string[]>(
    application?.preferences.rankedHostels ||
      hostels.filter((h) => h.genderPolicy === currentUser.gender).map((h) => h.id)
  );
  const [roomTypePrefs, setRoomTypePrefs] = useState<string[]>(
    application?.preferences.preferredRoomTypes || ['DOUBLE_AC', 'SINGLE_AC']
  );
  const [roommateRoll, setRoommateRoll] = useState<string>(
    application?.preferences.preferredRoommates?.[0] || ''
  );
  const [requireAccessible, setRequireAccessible] = useState<boolean>(
    application?.preferences.requireAccessible || !!currentUser.isPwD
  );
  const [preferQuietZone, setPreferQuietZone] = useState<boolean>(
    application?.preferences.preferQuietZone || true
  );

  const [lifestyle, setLifestyle] = useState({
    sleepSchedule: application?.lifestyleScores?.sleepSchedule || 3,
    studyHabit: application?.lifestyleScores?.studyHabit || 2,
    cleanliness: application?.lifestyleScores?.cleanliness || 4,
    guestFrequency: application?.lifestyleScores?.guestFrequency || 2,
    temperatureComfort: application?.lifestyleScores?.temperatureComfort || 3,
    foodHabit: application?.lifestyleScores?.foodHabit || 'VEG',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusDetailsOpen, setStatusDetailsOpen] = useState(false);

  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState(
    'Payment of Rs. 42,500 cleared via Bank Transfer Ref #SBI-99238472. Requesting provisional hostel eligibility clearance.'
  );
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  const [swapTargetRoll, setSwapTargetRoll] = useState('');
  const [swapReason, setSwapReason] = useState(
    'Prefer ground floor room to ease daily laboratory commute.'
  );
  const [swapRequested, setSwapRequested] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApplication(
      {
        rankedHostels,
        preferredRoomTypes: roomTypePrefs,
        preferredRoommates: roommateRoll ? [roommateRoll.trim()] : [],
        requireAccessible,
        preferQuietZone,
      },
      lifestyle
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const isEligible =
    currentUser.feeCleared && (currentUser.cgpa ?? 0) >= 5.0 && !currentUser.disciplinaryAction;

  const potentialMatches = allApplications.filter(
    (app) => app.studentId !== currentUser.id && app.gender === currentUser.gender
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-800/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Student Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{currentUser.name}</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-xs text-slate-300">Roll {currentUser.rollNumber}</span>
            <span className="text-slate-600">·</span>
            <span>{currentUser.department}</span>
            <span className="text-slate-600">·</span>
            <span>Year {currentUser.year}</span>
            {currentUser.isPwD && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-indigo-400 font-medium text-xs">PwD Priority</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-6 text-sm text-slate-400 self-start sm:self-auto">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">CGPA</span>
            <span className="font-medium text-slate-200">
              {currentUser.cgpa ? currentUser.cgpa.toFixed(2) : '—'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Distance</span>
            <span className="font-medium text-slate-200">{currentUser.distanceKm} km</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 sm:p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                !isEligible
                  ? 'bg-rose-500'
                  : isPublished && studentAssignment
                  ? 'bg-emerald-500'
                  : activeDraft && studentAssignment
                  ? 'bg-amber-400'
                  : 'bg-emerald-500'
              }`}
            />

            <div className="text-xs sm:text-sm text-slate-300 truncate">
              {!isEligible ? (
                <>
                  <span className="font-medium text-slate-100">Registration Hold</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-slate-400">Action required on university policy criteria</span>
                </>
              ) : isPublished && studentAssignment ? (
                <>
                  <span className="font-medium text-slate-100">Officially Allocated</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-slate-400">
                    {studentAssignment.hostelName}, Room {studentAssignment.roomNumber} (Bed {studentAssignment.bedCode})
                  </span>
                </>
              ) : activeDraft && studentAssignment ? (
                <>
                  <span className="font-medium text-slate-100">Eligible</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-slate-400">Preliminary draft generated (awaiting Warden sign-off)</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-slate-100">Eligible for Allocation</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-slate-400">Application cycle open for Session 2026–2027</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
            {!isEligible && (
              <button
                type="button"
                onClick={() => setAppealModalOpen(true)}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
              >
                Submit Appeal
              </button>
            )}

            {isPublished && studentAssignment && (
              <button
                id="download-allocation-letter-btn"
                onClick={() => onOpenLetterModal(studentAssignment)}
                className="flex items-center space-x-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Allocation Letter</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setStatusDetailsOpen(!statusDetailsOpen)}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>{statusDetailsOpen ? 'Hide' : 'Details'}</span>
              {statusDetailsOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {statusDetailsOpen && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2.5">
            <div className="font-medium text-slate-300">Policy Criteria Checklist</div>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center space-x-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentUser.feeCleared ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span>Semester Tuition & Dues: {currentUser.feeCleared ? 'Cleared' : 'Pending Clearance'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    (currentUser.cgpa ?? 0) >= 5.0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span>Academic Standing (CGPA ≥ 5.00): Current CGPA {currentUser.cgpa?.toFixed(2) ?? '—'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    !currentUser.disciplinaryAction ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span>Disciplinary Record: {!currentUser.disciplinaryAction ? 'Good Standing' : 'Proctorial Flag'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>
                  Geographical Distance: {currentUser.distanceKm ?? '—'} km{' '}
                  {(currentUser.distanceKm ?? 0) <= 25
                    ? '(Local category)'
                    : '(Outstation category)'}
                </span>
              </li>
            </ul>

            {application?.eligibilityReasons && application.eligibilityReasons.length > 0 && (
              <div className="pt-2 text-slate-400">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                  Engine Evaluation Notes:
                </div>
                <ul className="space-y-1 pl-1">
                  {application.eligibilityReasons.map((r, i) => (
                    <li key={i} className="text-slate-400">
                      • {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {isPublished && studentAssignment && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
                Official Allotment
              </span>
              <h2 className="text-base font-semibold text-white mt-0.5">
                {studentAssignment.hostelName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Room {studentAssignment.roomNumber} · Bed {studentAssignment.bedCode} ({studentAssignment.roomType.replace(/_/g, ' ')})
              </p>
            </div>

            <button
              onClick={() => onOpenLetterModal(studentAssignment)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors self-start sm:self-auto"
            >
              View Allotment Letter (PDF)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/60 text-xs">
            <div>
              <span className="text-slate-500 block">Roommate</span>
              <span className="text-slate-300 font-medium mt-0.5 block">
                {studentAssignment.roommateRollNumbers.length > 0
                  ? studentAssignment.roommateRollNumbers.join(', ')
                  : 'Single Occupancy'}
              </span>
              {studentAssignment.compatibilityScore > 0 && (
                <span className="text-slate-400 text-[11px]">
                  {studentAssignment.compatibilityScore}% lifestyle compatibility
                </span>
              )}
            </div>

            <div>
              <span className="text-slate-500 block">Preference Rank</span>
              <span className="text-slate-300 font-medium mt-0.5 block">
                {studentAssignment.preferenceRankAchieved === 1
                  ? 'Choice 1 Satisfied'
                  : studentAssignment.preferenceRankAchieved === 2
                  ? 'Choice 2 Satisfied'
                  : 'Policy Fallback'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Governance Note</span>
              <span className="text-slate-300 mt-0.5 block truncate">
                {studentAssignment.isOverridden
                  ? `Manual Reassignment: ${studentAssignment.overrideReason}`
                  : 'Chief Warden certified'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-800/80 pb-px overflow-x-auto">
          {[
            { id: 'preferences', label: '1. Preferences' },
            { id: 'questionnaire', label: '2. Lifestyle' },
            { id: 'matchmaker', label: '3. Matchmaker Hub' },
            { id: 'roomswap', label: '4. Room Swap' },
          ].map((tab) => {
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStep(tab.id as any)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap relative ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {activeStep === 'preferences' && (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Ranked Residence Choices
                </label>
                <span className="text-[11px] text-slate-500">
                  Click to toggle preference order
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {hostels
                  .filter((h) => h.genderPolicy === currentUser.gender)
                  .map((h) => {
                    const rank = rankedHostels.indexOf(h.id);
                    return (
                      <div
                        key={h.id}
                        onClick={() => {
                          let newRanked = [...rankedHostels];
                          if (newRanked.includes(h.id)) {
                            newRanked = newRanked.filter((id) => id !== h.id);
                          } else {
                            newRanked.push(h.id);
                          }
                          setRankedHostels(newRanked);
                        }}
                        className={`p-5 rounded-xl border text-left cursor-pointer transition-colors ${
                          rank >= 0
                            ? 'bg-indigo-950/20 border-indigo-500/50'
                            : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                              rank >= 0 ? 'text-indigo-400' : 'text-slate-500'
                            }`}
                          >
                            {rank >= 0 ? `Choice ${rank + 1}` : 'Unranked'}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm text-slate-100">{h.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {h.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-medium text-slate-300 block">
                Preferred Room Configurations
              </label>
              <div className="flex flex-wrap gap-2">
                {['DOUBLE_AC', 'SINGLE_AC', 'DOUBLE_NON_AC', 'TRIPLE_NON_AC'].map((type) => {
                  const selected = roomTypePrefs.includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => {
                        if (selected) {
                          setRoomTypePrefs(roomTypePrefs.filter((t) => t !== type));
                        } else {
                          setRoomTypePrefs([...roomTypePrefs, type]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {type.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/60">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Mutual Roommate Roll Number
                </label>
                <input
                  id="input-roommate-roll"
                  type="text"
                  placeholder="e.g. 2024CS102"
                  value={roommateRoll}
                  onChange={(e) => setRoommateRoll(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
                />
                <p className="text-[11px] text-slate-500 leading-normal">
                  Mutual pairing: If both students enter each other’s roll number, the engine pairs them into the same room.
                </p>
              </div>

              <div className="space-y-3 pt-1 md:pt-6">
                <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={preferQuietZone}
                    onChange={(e) => setPreferQuietZone(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Prefer Quiet Study Zone corridor</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requireAccessible}
                    onChange={(e) => setRequireAccessible(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Require Ground-Floor Wheelchair Accessible room</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
              <div>
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Preferences saved successfully</span>
                  </span>
                )}
              </div>

              <button
                id="submit-student-application-btn"
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}

        {activeStep === 'questionnaire' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-start space-x-2.5 text-xs text-slate-400 py-1">
              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                Encrypted at rest: Questionnaire responses are stored securely and used exclusively for anonymous compatibility calculations.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Chronotype / Sleep Cycle</span>
                  <span className="text-slate-400">
                    {lifestyle.sleepSchedule <= 2
                      ? 'Early Bird (5 AM – 10 PM)'
                      : lifestyle.sleepSchedule === 3
                      ? 'Moderate'
                      : 'Night Owl (2 AM – 10 AM)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={lifestyle.sleepSchedule}
                  onChange={(e) =>
                    setLifestyle({ ...lifestyle, sleepSchedule: Number(e.target.value) as any })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Cleanliness Standard</span>
                  <span className="text-slate-400">
                    {lifestyle.cleanliness >= 4
                      ? 'Strict / Daily Tidy'
                      : lifestyle.cleanliness === 3
                      ? 'Moderate'
                      : 'Casual / Relaxed'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={lifestyle.cleanliness}
                  onChange={(e) =>
                    setLifestyle({ ...lifestyle, cleanliness: Number(e.target.value) as any })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">In-Room Study Habit</span>
                  <span className="text-slate-400">
                    {lifestyle.studyHabit <= 2 ? 'Quiet Focus' : 'Group Study / Background Sound'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={lifestyle.studyHabit}
                  onChange={(e) =>
                    setLifestyle({ ...lifestyle, studyHabit: Number(e.target.value) as any })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Room AC & Temperature</span>
                  <span className="text-slate-400">
                    {lifestyle.temperatureComfort <= 2
                      ? 'Chilled AC (18°–20°C)'
                      : 'Moderate / Ambient'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={lifestyle.temperatureComfort}
                  onChange={(e) =>
                    setLifestyle({
                      ...lifestyle,
                      temperatureComfort: Number(e.target.value) as any,
                    })
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
              <div>
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Lifestyle preferences saved</span>
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Save Answers
              </button>
            </div>
          </form>
        )}

        {activeStep === 'matchmaker' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Compatibility matches based on anonymous lifestyle scores in your department and wing. Requesting a pair adds their roll number to your mutual roommate preferences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {potentialMatches.map((peer) => {
                const matchScore = peer.studentRoll === '2024CS102' ? 96 : 84;
                const isCurrentPref = roommateRoll === peer.studentRoll;

                return (
                  <div
                    key={peer.id}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      isCurrentPref
                        ? 'bg-indigo-950/20 border-indigo-500/50'
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-100 text-sm">
                            {peer.studentName}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            #{peer.studentRoll}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Year 3 · CGPA {peer.cgpa} · {peer.distanceKm} km
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-emerald-400 font-mono">
                          {matchScore}%
                        </span>
                        <span className="text-[10px] block text-slate-500">Match</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Sleep Schedule</span>
                        <span className="text-slate-300">Synchronized</span>
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-full h-1">
                        <div className="bg-emerald-500/80 h-1 rounded-full" style={{ width: '90%' }} />
                      </div>

                      <div className="flex justify-between">
                        <span>Study Habits</span>
                        <span className="text-slate-300">Quiet Focus</span>
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-full h-1">
                        <div className="bg-indigo-500/80 h-1 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setRoommateRoll(peer.studentRoll);
                          setActiveStep('preferences');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isCurrentPref
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        {isCurrentPref ? 'Requested as Roommate' : 'Request Mutual Pair'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeStep === 'roomswap' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Submit a mutual room swap request with another registered resident. Mutual swaps require confirmation from both students and Warden approval.
            </p>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Target Student Roll Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024CS102"
                  value={swapTargetRoll}
                  onChange={(e) => setSwapTargetRoll(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Reason for Exchange
                </label>
                <textarea
                  rows={2}
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {swapRequested ? (
                <div className="text-xs text-emerald-400 pt-1 flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Room swap request submitted to the Warden queue.</span>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSwapRequested(true)}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    Submit Swap Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {appealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">
                Submit Policy Exemption Appeal
              </h3>
              <button
                onClick={() => setAppealModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Submit proof of tuition fee clearance or medical documents for review by the Warden and Dean of Student Welfare.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Appeal Details & Reference Numbers
              </label>
              <textarea
                rows={3}
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {appealSubmitted && (
              <div className="text-xs text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Appeal submitted for administrative review.</span>
              </div>
            )}

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAppealModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setAppealSubmitted(true);
                  if (onClearStudentEligibility) {
                    onClearStudentEligibility(currentUser.id, appealReason);
                  }
                  setTimeout(() => setAppealModalOpen(false), 1200);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
