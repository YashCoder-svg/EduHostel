import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { seed = `SEED_${Date.now()}`, actorId } = body;

    const actor = hostelStore.getUserById(actorId) || hostelStore.getUsers().find((u) => u.role === 'HOSTEL_ADMIN');
    if (!actor) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const draft = hostelStore.runDraftAllocation(seed, actor);
    return NextResponse.json({ success: true, draft });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
