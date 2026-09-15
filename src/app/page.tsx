'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  BedDouble,
  HeartHandshake,
  FileCheck2,
  Lock,
  Cpu,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

function AnimatedNumber({
  value,
  suffix = '',
  duration = 1.2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = React.useState(shouldReduceMotion ? value : 0);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(easeOut * value));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const { hostels, activeDraft } = useApp();
  const shouldReduceMotion = useReducedMotion();

  let totalBeds = 0;
  for (const h of hostels) {
    for (const b of h.blocks) {
      for (const f of b.floors) {
        for (const r of f.rooms) {
          totalBeds += r.beds.length;
        }
      }
    }
  }

  const assignedBeds = activeDraft?.assignments.length || 0;
  const satisfactionRate = activeDraft?.metrics.satisfactionRate || 94;
  const avgCompat = activeDraft?.metrics.avgCompatibility || 88;

  const statCards = [
    {
      label: 'Total Campus Beds',
      value: totalBeds || 108,
      suffix: '',
      subtext: 'across 3 Halls',
      valueColor: 'text-white',
      isPrimary: false,
    },
    {
      label: 'Preference Satisfaction',
      value: satisfactionRate,
      suffix: '%',
      subtext: '1st or 2nd choice',
      valueColor: 'text-emerald-400',
      isPrimary: false,
    },
    {
      label: 'Compatibility Index',
      value: avgCompat,
      suffix: '%',
      subtext: 'Roommate alignment',
      valueColor: 'text-indigo-300',
      isPrimary: true,
    },
    {
      label: 'Hard Violations',
      value: 0,
      suffix: '',
      subtext: '100% Policy Compliant',
      valueColor: 'text-emerald-400',
      isPrimary: false,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden pt-14 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-[#0b101d] via-[#090d16] to-[#090d16]">
        <motion.div
          initial={shouldReduceMotion ? {} : { scale: 1, opacity: 0.12 }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.12, 0.18, 0.12],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-indigo-600/15 blur-[130px] pointer-events-none rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300 text-xs font-semibold shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Academic Session 2026–2027 Allocation Cycle Active</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.14]"
            >
              Hostel Allotment, Solved by <span className="text-indigo-400">Constraints, Not Chaos</span>.
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed"
            >
              Bed-level allocation that matches student lifestyles and enforces institutional policy — automatically.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col items-center justify-center space-y-4"
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/student"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.38 }}
                className="text-xs text-slate-400 flex items-center space-x-2"
              >
                <span>Warden?</span>
                <Link
                  href="/warden"
                  className="text-slate-300 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors"
                >
                  Go to Bed Map
                </Link>
                <span className="text-slate-600">·</span>
                <Link
                  href="/verify"
                  className="text-slate-300 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors inline-flex items-center space-x-1"
                >
                  <span>Verify a Letter</span>
                  <span className="ml-0.5">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-20 lg:mt-24 pt-10 border-t border-slate-800/80">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 px-3 sm:px-4 w-full overflow-hidden text-center sm:text-left"
              >
                <div className="flex items-center space-x-2 min-w-0 max-w-full">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 font-semibold truncate">
                    Live Operational Telemetry · Academic Session 2026–2027
                  </span>
                </div>
                <div
                  title="Deterministic Seeded Engine: The allocation uses a fixed mathematical seed (Seed #42). Given identical student preferences and room inventory, the algorithm will always produce the exact same conflict-free allocation every single time, with zero hard-constraint violations."
                  className="group relative shrink-0 flex items-center space-x-1.5 text-slate-300 hover:text-white text-[11px] font-mono cursor-help px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <span className="truncate">Allocation Run #204 · Deterministic &amp; Reproducible</span>
                  <HelpCircle className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors ml-0.5 shrink-0" />
                </div>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
                {statCards.map((card, idx) => (
                  <motion.div
                    key={card.label}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.55,
                      delay: shouldReduceMotion ? 0 : idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: -3,
                            transition: { duration: 0.2, ease: 'easeOut' },
                          }
                    }
                    className={`p-5 rounded-xl text-center flex flex-col justify-between transition-colors ${
                      card.isPrimary
                        ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900/90 border border-indigo-500/50 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/20 hover:border-indigo-400 scale-[1.02] relative overflow-hidden'
                        : 'bg-slate-900/60 border border-slate-800/80 shadow-inner hover:border-slate-700/80'
                    }`}
                  >
                    {card.isPrimary && (
                      <div className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                    )}
                    <span
                      className={`text-[11px] uppercase tracking-wider block ${
                        card.isPrimary ? 'font-semibold text-indigo-300' : 'font-medium text-slate-400'
                      }`}
                    >
                      {card.label}
                    </span>
                    <span
                      className={`text-3xl font-bold font-mono my-1.5 block ${card.valueColor} ${
                        card.isPrimary ? 'text-4xl font-extrabold tracking-tight drop-shadow-sm' : ''
                      }`}
                    >
                      <AnimatedNumber value={card.value} suffix={card.suffix} duration={1.2} />
                    </span>
                    <span
                      className={`text-[11px] block ${
                        card.isPrimary
                          ? 'text-indigo-300/80 font-medium'
                          : card.label === 'Hard Violations'
                          ? 'text-emerald-400/80'
                          : 'text-slate-400'
                      }`}
                    >
                      {card.subtext}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Campus Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Residential Halls & Complexes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Equipped with Wi-Fi 6, study halls, accessible ramps, and 24/7 security.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View Full Inventory Hierarchy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <div
              key={hostel.id}
              className="glass-panel rounded-2xl p-6 border-slate-800/90 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {hostel.code} • {hostel.genderPolicy}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{hostel.name}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {hostel.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-4">
                  {hostel.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Capacity:</span>
                <span className="font-bold text-white font-mono">{hostel.totalCapacity} Beds</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Deterministic Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How the Allocation Process Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Replacing opaque spreadsheets with an explainable, auditable, and rule-based workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm font-mono border border-blue-500/30">
                01
              </div>
              <h4 className="font-bold text-sm text-white">Apply & Preferences</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eligible students rank hostel choices, select room types, and optionally cross-reference mutual roommate roll numbers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm font-mono border border-purple-500/30">
                02
              </div>
              <h4 className="font-bold text-sm text-white">Lifestyle Compatibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consented answers (sleep schedule, study quietness, cleanliness) are encrypted at rest with salted cipher to match compatible roommates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm font-mono border border-indigo-500/30">
                03
              </div>
              <h4 className="font-bold text-sm text-white">Seeded Heuristic Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A seeded PRNG executes in seconds. Enforces hard constraints (gender, PwD ground floor, capacity) and produces an explainable draft.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm font-mono border border-emerald-500/30">
                04
              </div>
              <h4 className="font-bold text-sm text-white">Warden Review & Publish</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Wardens review floor maps, log overrides with mandatory reasons, sign certification, and publish verifiable allotment letters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Residential Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Approved Policy & Eligibility Criteria
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              In accordance with Dean of Student Welfare regulations, accommodation is allotted based on verified university records.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Fee & Dues Clearance (Mandatory)</strong>
                  <p className="text-slate-400 mt-0.5">
                    Tuition and hostel fees must be cleared in the ERP system prior to allocation run.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Minimum Academic Standing (CGPA &gt;= 5.00)</strong>
                  <p className="text-slate-400 mt-0.5">
                    Students on active academic probation or CGPA below 5.00 are placed on hold.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Distance Priority (Distance &gt;= 25 KM)</strong>
                  <p className="text-slate-400 mt-0.5">
                    Outstation students are prioritized before day scholars residing within 25 km of campus.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">PwD Medical Priority (Ground Floor Allocation)</strong>
                  <p className="text-slate-400 mt-0.5">
                    Students with declared physical accommodations are guaranteed ground-floor accessible rooms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Session Deadlines & Academic Calendar</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex justify-between items-center">
                <div>
                  <strong className="text-white block">Phase 1: Applications Open</strong>
                  <span className="text-slate-400">Submission of ranked preferences</span>
                </div>
                <span className="font-mono text-indigo-300 font-semibold">August 01, 2026</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex justify-between items-center">
                <div>
                  <strong className="text-white block">Phase 2: Preferences Deadline</strong>
                  <span className="text-slate-400">Questionnaire lock date</span>
                </div>
                <span className="font-mono text-amber-300 font-semibold">August 12, 2026</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex justify-between items-center">
                <div>
                  <strong className="text-white block">Phase 3: Warden Review Period</strong>
                  <span className="text-slate-400">Draft inspection & overrides</span>
                </div>
                <span className="font-mono text-purple-300 font-semibold">August 13, 2026</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex justify-between items-center">
                <div>
                  <strong className="text-white block">Phase 4: Publication & Move-in</strong>
                  <span className="text-slate-400">Official allotment letter release</span>
                </div>
                <span className="font-mono text-emerald-300 font-semibold">August 14, 2026</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/student"
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30"
              >
                <span>Check Your Application Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
