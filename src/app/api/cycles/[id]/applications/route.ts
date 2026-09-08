import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const applications = hostelStore
    .getApplications()
    .filter((a) => a.cycleId === id);
  return NextResponse.json({ success: true, applications });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { studentId, preferences, lifestyle } = body;

    const student = hostelStore.getUserById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student user not found' }, { status: 404 });
    }

    const application = hostelStore.submitApplication(student, preferences, lifestyle);
    return NextResponse.json({ success: true, application });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
