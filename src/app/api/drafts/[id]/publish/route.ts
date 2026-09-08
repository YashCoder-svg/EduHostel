import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { actorId } = body;

    const actor = hostelStore.getUserById(actorId);
    if (!actor || (actor.role !== 'CHIEF_WARDEN' && actor.role !== 'WARDEN' && actor.role !== 'SYS_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only Chief Warden or System Admin can publish the finalized allocation.' },
        { status: 403 }
      );
    }

    // Attempt publication (hostelStore strictly enforces recorded warden approval)
    const result = hostelStore.publishAllocation(id, actor);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          governanceViolation: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Allocations published successfully. Student notification and allocation letters enabled.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
