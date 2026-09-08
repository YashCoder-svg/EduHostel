import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { wardenId, action = 'APPROVED', notes = 'Draft reviewed and approved.' } = body;

    const warden = hostelStore.getUserById(wardenId);
    if (!warden || (warden.role !== 'WARDEN' && warden.role !== 'CHIEF_WARDEN' && warden.role !== 'SYS_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only Wardens or Chief Wardens can sign off on drafts.' },
        { status: 403 }
      );
    }

    const result = hostelStore.recordWardenApproval({
      draftId: id,
      warden,
      action,
      notes,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Draft marked as ${action}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
