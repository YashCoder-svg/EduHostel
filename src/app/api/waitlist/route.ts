import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function GET() {
  const waitlist = hostelStore.getWaitlist();
  return NextResponse.json({ success: true, waitlist });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entryId, actorId } = body;

    const actor = hostelStore.getUserById(actorId);
    if (!actor) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = hostelStore.promoteWaitlist(entryId, actor);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Candidate promoted from waitlist' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
