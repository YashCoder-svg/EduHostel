import type { LifestyleQuestionnaire } from '../types';

/**
 * M5: Compatibility Questionnaire & Scoring
 * Computes pairwise compatibility (0 - 100%) between two applicants
 * Weights:
 * - Sleep schedule (Chronotype): 30%
 * - Cleanliness & Tidiness: 25%
 * - Study habits / Noise tolerance: 20%
 * - Guest & Social frequency: 15%
 * - Temperature / AC comfort: 10%
 * - Food habit penalty if strict mismatch: up to -10%
 */
export function calculateCompatibilityScore(
  a: LifestyleQuestionnaire,
  b: LifestyleQuestionnaire
): number {
  if (!a || !b) return 50;

  // Max diff per 1-5 scale is 4. Similarity = 1 - (abs(diff) / 4)
  const sleepSim = 1 - Math.abs(a.sleepSchedule - b.sleepSchedule) / 4;
  const cleanSim = 1 - Math.abs(a.cleanliness - b.cleanliness) / 4;
  const studySim = 1 - Math.abs(a.studyHabit - b.studyHabit) / 4;
  const guestSim = 1 - Math.abs(a.guestFrequency - b.guestFrequency) / 4;
  const tempSim = 1 - Math.abs(a.temperatureComfort - b.temperatureComfort) / 4;

  let score =
    sleepSim * 30 +
    cleanSim * 25 +
    studySim * 20 +
    guestSim * 15 +
    tempSim * 10;

  // Food habit compatibility
  if (a.foodHabit !== 'ANY' && b.foodHabit !== 'ANY' && a.foodHabit !== b.foodHabit) {
    score -= 8;
  }

  // Round to nearest integer between 10 and 100
  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Calculates a summary explanation of match quality between roommates
 */
export function getCompatibilityBreakdown(
  a: LifestyleQuestionnaire,
  b: LifestyleQuestionnaire
): { overallScore: number; highlights: string[]; concerns: string[] } {
  const score = calculateCompatibilityScore(a, b);
  const highlights: string[] = [];
  const concerns: string[] = [];

  if (Math.abs(a.sleepSchedule - b.sleepSchedule) <= 1) {
    highlights.push('Synchronized sleep & wake cycle');
  } else if (Math.abs(a.sleepSchedule - b.sleepSchedule) >= 3) {
    concerns.push('Divergent chronotypes (Night Owl vs Early Bird)');
  }

  if (Math.abs(a.cleanliness - b.cleanliness) <= 1) {
    highlights.push('Well-matched room cleanliness expectations');
  } else if (Math.abs(a.cleanliness - b.cleanliness) >= 3) {
    concerns.push('Different hygiene and room organization standards');
  }

  if (Math.abs(a.studyHabit - b.studyHabit) <= 1) {
    highlights.push('Harmonious in-room study and quiet hour habits');
  }

  if (a.foodHabit === b.foodHabit && a.foodHabit !== 'ANY') {
    highlights.push(`Shared ${a.foodHabit} food lifestyle`);
  }

  return { overallScore: score, highlights, concerns };
}
