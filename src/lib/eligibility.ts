import type { Application, EligibilityRule, EligibilityStatus, User } from '../types';

export const DEFAULT_ELIGIBILITY_RULES: EligibilityRule[] = [
  {
    id: 'rule-fee',
    name: 'Tuition & Hostel Dues Clearance',
    field: 'feeCleared',
    operator: '==',
    value: true,
    mandatory: true,
    rejectionReason: 'Outstanding semester fee dues pending in ERP/Finance account.',
  },
  {
    id: 'rule-cgpa',
    name: 'Minimum Academic Standing (CGPA >= 5.0)',
    field: 'cgpa',
    operator: '>=',
    value: 5.0,
    mandatory: true,
    rejectionReason: 'CGPA is below the minimum threshold (5.00) for hostel residency.',
  },
  {
    id: 'rule-discipline',
    name: 'Disciplinary Record Clear',
    field: 'disciplinaryAction',
    operator: '==',
    value: false,
    mandatory: true,
    rejectionReason: 'Active disciplinary probation recorded with Proctor office.',
  },
  {
    id: 'rule-distance',
    name: 'Home-to-Campus Distance (>= 25 KM)',
    field: 'distanceKm',
    operator: '>=',
    value: 25,
    mandatory: false,
    rejectionReason: 'Local day-scholar distance is under the 25 KM priority limit.',
  },
];

export function validateEligibility(
  student: User,
  rules: EligibilityRule[] = DEFAULT_ELIGIBILITY_RULES
): { status: EligibilityStatus; reasons: string[] } {
  const failedReasons: string[] = [];
  const passedReasons: string[] = [];

  for (const rule of rules) {
    const studentVal = (student as any)[rule.field];
    let passed = false;

    switch (rule.operator) {
      case '==':
        passed = studentVal === rule.value;
        break;
      case '!=':
        passed = studentVal !== rule.value;
        break;
      case '>=':
        passed = (studentVal ?? 0) >= rule.value;
        break;
      case '<=':
        passed = (studentVal ?? 0) <= rule.value;
        break;
      case '>':
        passed = (studentVal ?? 0) > rule.value;
        break;
    }

    if (!passed) {
      failedReasons.push(rule.rejectionReason);
    } else {
      passedReasons.push(`Passed ${rule.name}`);
    }
  }

  if (failedReasons.length > 0) {
    return {
      status: 'INELIGIBLE',
      reasons: failedReasons,
    };
  }

  return {
    status: 'ELIGIBLE',
    reasons: passedReasons,
  };
}
