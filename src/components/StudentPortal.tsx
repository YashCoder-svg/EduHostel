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
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Sparkles,
  Users,
  BedDouble,
  HeartHandshake,
  Send,
  HelpCircle,
  Search,
  UserPlus,
  Repeat,
  FileCheck,
  ShieldCheck,
  Clock,
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

  // Navigation steps
  const [activeStep, setActiveStep] = useState<
    'preferences' | 'questionnaire' | 'matchmaker' | 'roomswap'
  >('preferences');

  // Form state
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

  // Lifestyle form
  const [lifestyle, setLifestyle] = useState({
    sleepSchedule: application?.lifestyleScores?.sleepSchedule || 3,
    studyHabit: application?.lifestyleScores?.studyHabit || 2,
    cleanliness: application?.lifestyleScores?.cleanliness || 4,
    guestFrequency: application?.lifestyleScores?.guestFrequency || 2,
    temperatureComfort: application?.lifestyleScores?.temperatureComfort || 3,
    foodHabit: application?.lifestyleScores?.foodHabit || 'VEG',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Appeal Modal State
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState(
    'Payment of Rs. 42,500 cleared via Bank Transfer Ref #SBI-99238472. Requesting provisional hostel eligibility clearance.'
  );
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  // Room Swap Marketplace State
  const [swapTargetRoll, setSwapTargetRoll] = useState('');
  const [swapReason, setSwapReason] = useState('Prefer ground floor room to ease daily laboratory commute.');
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
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const isEligible =
    currentUser.feeCleared && (currentUser.cgpa ?? 0) >= 5.0 && !currentUser.disciplinaryAction;

  // Potential compatible peers for the Matchmaker Hub
  const potentialMatches = allApplications.filter(
    (app) => app.studentId !== currentUser.id && app.gender === currentUser.gender
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Welcome Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">
                Student Residential Portal
              </h1>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Roll #{currentUser.rollNumber}
              </span>
              {currentUser.isPwD && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PwD Medical Priority
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentUser.name} • {currentUser.department} • Year {currentUser.year} • Gender: {currentUser.gender}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Academic Standing</span>
              <span className="text-sm font-semibold text-white">
                CGPA: {currentUser.cgpa?.toFixed(2)}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Distance Priority</span>
              <span className="text-sm font-semibold text-white">
                {currentUser.distanceKm} KM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 3: Eligibility & Policy Validation Box */}
      <div
        className={`rounded-2xl border p-5 transition-all ${
          isEligible
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            {isEligible ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold">
                  {isEligible
                    ? 'Policy Validation: ELIGIBLE FOR ALLOCATION'
                    : 'Policy Validation: INELIGIBLE / REGISTRATION HOLD'}
                </h3>
              </div>
              <p className="text-xs opacity-90 mt-1">
                {isEligible
                  ? 'Student meets all approved residential guidelines (Finance clearance, CGPA >= 5.0, distance threshold, proctorial clearance).'
                  : 'The allocation engine has flagged policy holds for this student account:'}
              </p>

              <ul className="mt-2 text-xs space-y-1">
                {application?.eligibilityReasons?.map((reason, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <span>•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!isEligible && (
            <button
              onClick={() => setAppealModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-all shrink-0"
            >
              Submit Policy Appeal / Clearance Proof
            </button>
          )}
        </div>
      </div>

      {/* Published Result Section (If published) */}
      {isPublished && studentAssignment ? (
        <div className="glass-panel rounded-2xl p-6 border-indigo-500/40 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OFFICIALLY ALLOCATED
                </span>
                <span className="text-xs text-slate-400">
                  Warden Approved & Published
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                {studentAssignment.hostelName}
              </h2>
              <p className="text-sm text-indigo-300 font-mono">
                Room {studentAssignment.roomNumber} • Bed {studentAssignment.bedCode} ({studentAssignment.roomType.replace('_', ' ')})
              </p>
            </div>

            <button
              id="download-allocation-letter-btn"
              onClick={() => onOpenLetterModal(studentAssignment)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print Allocation Letter (PDF)</span>
            </button>
          </div>

          {/* Assignment Explanation */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Roommate Match</span>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium text-white">
                  {studentAssignment.roommateRollNumbers.length > 0
                    ? studentAssignment.roommateRollNumbers.join(', ')
                    : 'Single Occupancy'}
                </span>
              </div>
              {studentAssignment.compatibilityScore > 0 && (
                <div className="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{studentAssignment.compatibilityScore}% Compatibility Match</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Preference Satisfaction</span>
              <span className="text-sm font-semibold text-white">
                {studentAssignment.preferenceRankAchieved === 1
                  ? '🌟 1st Choice Preference Satisfied'
                  : studentAssignment.preferenceRankAchieved === 2
                  ? '⭐ 2nd Choice Satisfied'
                  : 'Policy Fallback Allocated'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Merit CGPA and distance priority satisfied.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Warden Governance Note</span>
              <span className="text-xs text-slate-300">
                {studentAssignment.isOverridden
                  ? `Manual Reassignment: "${studentAssignment.overrideReason}"`
                  : 'Certified by Warden review and Chief Warden authorization.'}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <strong className="text-indigo-400">Engine Assignment Trace:</strong>{' '}
            {studentAssignment.explanation}
          </div>
        </div>
      ) : activeDraft && studentAssignment ? (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">
              Preliminary Allocation Draft Generated (Under Warden Governance Review)
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            The allocation engine has prepared a draft. Room allocations remain confidential until approved and published by the Warden.
          </p>
        </div>
      ) : null}

      {/* Navigation Subtabs */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Application Preferences & Lifestyle Matching</span>
            </h2>
            <p className="text-xs text-slate-400">
              Fine-tune your residence preferences, explore compatible roommates, or request room swaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveStep('preferences')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStep === 'preferences'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              1. Preferences
            </button>
            <button
              onClick={() => setActiveStep('questionnaire')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStep === 'questionnaire'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              2. Lifestyle
            </button>
            <button
              onClick={() => setActiveStep('matchmaker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                activeStep === 'matchmaker'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>3. Matchmaker Hub</span>
            </button>
            <button
              onClick={() => setActiveStep('roomswap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                activeStep === 'roomswap'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>4. Room Swap</span>
            </button>
          </div>
        </div>

        {/* Step 1: Preferences */}
        {activeStep === 'preferences' && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Ranked Hostel Choices (Click to Select / Prioritize)
              </label>
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
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          rank >= 0
                            ? 'bg-indigo-600/15 border-indigo-500/50 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-black/40">
                            {rank >= 0 ? `Choice #${rank + 1}` : 'Unselected'}
                          </span>
                          <BedDouble className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h4 className="font-semibold text-sm text-white mt-2">{h.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {h.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Room Types
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
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mutual Roommate Preference (Roll Number)
                </label>
                <input
                  id="input-roommate-roll"
                  type="text"
                  placeholder="e.g. 2024CS102"
                  value={roommateRoll}
                  onChange={(e) => setRoommateRoll(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Mutual match: If both students enter each other’s roll number, the engine guarantees room co-allocation.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferQuietZone}
                    onChange={(e) => setPreferQuietZone(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Prefer Quiet Study Zone corridors</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireAccessible}
                    onChange={(e) => setRequireAccessible(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Require Ground-Floor Wheelchair Accessible room</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Preferences saved successfully!</span>
                </span>
              )}
              <div className="ml-auto">
                <button
                  id="submit-student-application-btn"
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Questionnaire */}
        {activeStep === 'questionnaire' && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-700/40 flex items-start space-x-3">
              <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200">
                <strong>Encrypted-at-Rest Privacy Guarantee:</strong>
                <p className="opacity-85 mt-0.5">
                  Individual questionnaire responses are encrypted at rest with a salted cipher. No raw fields are exposed—only aggregate match quality scores are calculated.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Chronotype / Sleep Cycle</span>
                  <span className="text-indigo-400 font-bold">
                    {lifestyle.sleepSchedule <= 2
                      ? 'Early Bird (5 AM - 10 PM)'
                      : lifestyle.sleepSchedule === 3
                      ? 'Moderate'
                      : 'Night Owl (2 AM - 10 AM)'}
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
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Cleanliness Standard</span>
                  <span className="text-indigo-400 font-bold">
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
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">In-Room Study Habit</span>
                  <span className="text-indigo-400 font-bold">
                    {lifestyle.studyHabit <= 2 ? 'Pin-Drop Silence' : 'Music / Group Study'}
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
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Room AC & Temperature</span>
                  <span className="text-indigo-400 font-bold">
                    {lifestyle.temperatureComfort <= 2
                      ? 'Chilled AC (18°-20°C)'
                      : 'Moderate / Fan Air'}
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
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
              >
                Save Lifestyle Answers
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Roommate Matchmaker Hub */}
        {activeStep === 'matchmaker' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-start space-x-3">
              <HeartHandshake className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200">
                <strong>Roommate Compatibility Matchmaker:</strong>
                <p className="opacity-85 mt-0.5">
                  Browse anonymized compatibility profiles of students in your department and wing. Clicking "Request Mutual Pair" automatically adds their roll number to your preferences!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {potentialMatches.map((peer) => {
                const matchScore = peer.studentRoll === '2024CS102' ? 96 : 84;
                const isCurrentPref = roommateRoll === peer.studentRoll;

                return (
                  <div
                    key={peer.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrentPref
                        ? 'bg-indigo-950/30 border-indigo-500/60'
                        : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">
                            {peer.studentName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            #{peer.studentRoll}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Year 3 • CGPA: {peer.cgpa} • Distance: {peer.distanceKm} KM
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold text-emerald-400 font-mono">
                          {matchScore}% Match
                        </span>
                        <span className="text-[10px] block text-slate-400">Pairwise Index</span>
                      </div>
                    </div>

                    {/* Compatibility Dimension Bars */}
                    <div className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span>Chronotype Sync</span>
                        <span className="text-emerald-400 font-semibold">Night Owl Sync</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '90%' }} />
                      </div>

                      <div className="flex justify-between">
                        <span>Study Habits Alignment</span>
                        <span className="text-indigo-400 font-semibold">Quiet Focused</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setRoommateRoll(peer.studentRoll);
                          setActiveStep('preferences');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                          isCurrentPref
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                      >
                        {isCurrentPref ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Requested as Roommate</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Request Mutual Pair</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Room Swap Marketplace */}
        {activeStep === 'roomswap' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-start space-x-3">
              <Repeat className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-200">
                <strong>Post-Allocation Room Change & Swap Marketplace:</strong>
                <p className="opacity-85 mt-0.5">
                  Request a mutual room exchange with another student. Both students must submit approval before the Warden conducts the final reassignment review.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Student Roll Number to Swap With
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024CS102"
                  value={swapTargetRoll}
                  onChange={(e) => setSwapTargetRoll(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mutual Exchange Justification (Required for Warden Review)
                </label>
                <textarea
                  rows={2}
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              {swapRequested ? (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Room swap request logged and submitted to Warden review queue!</span>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSwapRequested(true)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25"
                  >
                    Submit Swap Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appeal Submission Modal */}
      {appealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  Submit Policy Hold Exemption Appeal
                </h3>
              </div>
              <button
                onClick={() => setAppealModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide evidence of semester fee clearance or medical documentation for administrative review by the Warden and Dean of Student Welfare.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Appeal Justification & Bank / Medical Reference
              </label>
              <textarea
                rows={4}
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {appealSubmitted && (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300">
                Appeal successfully submitted to Warden desk! (Testing simulation: You can approve this in the Admin panel).
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAppealModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
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
                  setTimeout(() => setAppealModalOpen(false), 1500);
                }}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25"
              >
                Submit Appeal to DSW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
