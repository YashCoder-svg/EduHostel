import { NextResponse } from 'next/server';
import { hostelStore } from '@/lib/storage';

export async function GET() {
  const hostels = hostelStore.getHostels();
  return NextResponse.json({ success: true, hostels });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, hostelId, blockId, floorNumber, rooms } = body;

    if (action === 'BULK_IMPORT') {
      const added = hostelStore.bulkImportRooms(hostelId, blockId, floorNumber, rooms);
      return NextResponse.json({ success: true, count: added });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
