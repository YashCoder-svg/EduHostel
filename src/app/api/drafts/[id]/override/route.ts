import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { assignmentId, newBedId, wardenId, mandatoryReason } = body;

    const warden = hostelStore.getUserById(wardenId);
    if (!warden || (warden.role !== 'WARDEN' && warden.role !== 'CHIEF_WARDEN' && warden.role !== 'SYS_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Only designated Wardens or Administrators can perform bed reassignments.' },
        { status: 403 }
      );
    }

    const result = hostelStore.reassignBedWithOverride({
      draftId: id,
      assignmentId,
      newBedId,
      warden,
      mandatoryReason,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Override applied and audit record logged' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
