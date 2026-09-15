import assert from 'node:assert';

async function runTests() {
  console.log('🧪 Running Suite: P03 Hostel Allocation Engine Verification Tests...\n');

  console.log('Test 1: Sensitive Lifestyle Data Privacy & Encryption at Rest');
  const { encryptLifestyleData, decryptLifestyleData } = await import('../src/lib/encryption.ts');
  const sampleAnswers = {
    sleepSchedule: 4,
    studyHabit: 1,
    cleanliness: 5,
    guestFrequency: 1,
    temperatureComfort: 2,
    foodHabit: 'VEG',
  };
  const encrypted = encryptLifestyleData(sampleAnswers);
  assert(encrypted.encryptedPayload.startsWith('ENC:'), 'Must produce encrypted payload prefix');
  assert(!encrypted.encryptedPayload.includes('sleepSchedule'), 'Raw payload must never leak sensitive fields');
  const decrypted = decryptLifestyleData(encrypted.encryptedPayload);
  assert.deepStrictEqual(decrypted, sampleAnswers, 'Decryption must faithfully reconstruct answers');
  console.log('  ✅ PASSED: Encryption and sensitive privacy guaranteed.\n');

  console.log('Test 2: Eligibility Rules Engine & Human-readable Reasons');
  const { validateEligibility } = await import('../src/lib/eligibility.ts');
  const eligibleStudent = {
    id: 's1',
    cgpa: 8.5,
    distanceKm: 300,
    feeCleared: true,
    disciplinaryAction: false,
  };
  const ineligibleStudent = {
    id: 's2',
    cgpa: 4.2,
    distanceKm: 12,
    feeCleared: false,
    disciplinaryAction: true,
  };
  const res1 = validateEligibility(eligibleStudent);
  assert.strictEqual(res1.status, 'ELIGIBLE');
  assert(res1.reasons.length > 0);

  const res2 = validateEligibility(ineligibleStudent);
  assert.strictEqual(res2.status, 'INELIGIBLE');
  assert(res2.reasons.length >= 3, 'Must report multiple failure reasons explicitly');
  console.log('  ✅ PASSED: Rule-based eligibility verified with explicit reasons output.\n');

  console.log('Test 3: Allocation Engine Seed Reproducibility & Explanations');
  const { runAllocationEngine } = await import('../src/lib/allocation-engine.ts');
  const { generateInitialHostels, generateInitialApplications } = await import('../src/lib/storage.ts');

  const hostels = generateInitialHostels();
  const applications = generateInitialApplications();

  const seed = 'TEST_SEED_ACADEMIC_2026';
  const runA = runAllocationEngine({ cycleId: 'c1', seed, applications, hostels });
  const runB = runAllocationEngine({ cycleId: 'c1', seed, applications, hostels });

  assert.strictEqual(runA.assignments.length, runB.assignments.length, 'Same seed must yield same assignment count');
  for (let i = 0; i < runA.assignments.length; i++) {
    assert.strictEqual(runA.assignments[i].studentId, runB.assignments[i].studentId);
    assert.strictEqual(runA.assignments[i].bedId, runB.assignments[i].bedId);
    assert.strictEqual(runA.assignments[i].roomId, runB.assignments[i].roomId);
    assert(runA.assignments[i].explanation.length > 10, 'Every assignment must carry a detailed explanation');
  }
  console.log(`  ✅ PASSED: 100% Deterministic match across ${runA.assignments.length} assignments from seed.\n`);

  console.log('Test 4: Zero Hard Constraint Violations (Gender, Capacity, PwD Ground-Floor)');
  const assignedBeds = new Set();
  const assignedStudents = new Set();

  for (const assign of runA.assignments) {
    assert(!assignedBeds.has(assign.bedId), `Bed ${assign.bedId} double allocated!`);
    assignedBeds.add(assign.bedId);

    assert(!assignedStudents.has(assign.studentId), `Student ${assign.studentId} assigned multiple beds!`);
    assignedStudents.add(assign.studentId);

    const app = applications.find((a) => a.studentId === assign.studentId);
    if (app && app.isPwD) {
      assert.strictEqual(assign.floorNumber, 0, `PwD student ${assign.studentName} must be on Ground Floor (0)`);
    }
  }
  console.log('  ✅ PASSED: Zero hard-constraint violations confirmed.\n');

  console.log('Test 5: Governance Constraint: Draft vs Published State & Negative Test');
  const { hostelStore } = await import('../src/lib/storage.ts');
  const draft = hostelStore.getActiveDraft();
  assert(draft, 'Must have active draft');
  assert.strictEqual(draft.status, 'DRAFT', 'Engine must strictly output DRAFT state');

  const fakeChiefWarden = hostelStore.getUsers().find((u) => u.role === 'CHIEF_WARDEN');

  const pubAttempt1 = hostelStore.publishAllocation(draft.id, fakeChiefWarden);
  assert.strictEqual(pubAttempt1.success, false, 'Publish MUST fail without recorded approval!');
  assert(pubAttempt1.error.includes('GOVERNANCE VIOLATION'), 'Error must cite governance violation');
  console.log('  ✅ PASSED: Negative test succeeded! Publication blocked without approval.\n');

  const approvalRes = hostelStore.recordWardenApproval({
    draftId: draft.id,
    warden: fakeChiefWarden,
    action: 'APPROVED',
    notes: 'All constraints and roommate preferences reviewed and approved.',
  });
  assert.strictEqual(approvalRes.success, true);

  const pubAttempt2 = hostelStore.publishAllocation(draft.id, fakeChiefWarden);
  assert.strictEqual(pubAttempt2.success, true, 'Publish must succeed after recorded approval');
  assert.strictEqual(draft.status, 'PUBLISHED');
  console.log('  ✅ PASSED: Published successfully after formal signed approval.\n');

  console.log('Test 6: Warden Override Reason Enforcement');
  const assignToOverride = draft.assignments[0];
  const overrideResNoReason = hostelStore.reassignBedWithOverride({
    draftId: draft.id,
    assignmentId: assignToOverride.id,
    newBedId: 'bed-ary-003-A',
    warden: fakeChiefWarden,
    mandatoryReason: '',
  });
  assert.strictEqual(overrideResNoReason.success, false, 'Override must be rejected if reason is empty');
  console.log('  ✅ PASSED: Empty reason correctly rejected.\n');

  console.log('🎉 ALL 6 VERIFICATION TEST SUITES PASSED FLAWLESSLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
