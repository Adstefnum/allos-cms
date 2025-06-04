import { NextResponse } from 'next/server';
import { updateData } from '@/libs/update';

export async function POST() {
  try {
    await updateData();
    return NextResponse.json({ success: true, message: 'Member statuses updated.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 