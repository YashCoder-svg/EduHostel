import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function GET() {
  const auditLogs = hostelStore.getAuditLogs();
  const overrides = hostelStore.getOverrides();
  const approvals = hostelStore.getApprovals();
  return NextResponse.json({
    success: true,
    auditLogs,
    overrides,
    approvals,
  });
}
