import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const draft = hostelStore.getDraftById(id) || hostelStore.getActiveDraft();
  if (!draft) {
    return NextResponse.json({ success: false, error: 'Draft not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, draft });
}
