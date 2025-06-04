import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import Member from '@/models/Member';
import { parse } from 'csv-parse/sync';

// export const runtime = 'edge'; // for file upload support

export async function POST(request) {
  await connectMongo();
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const text = await file.text();
  let records;
  try {
    records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
  }
  const toInsert = records
    .filter(row => row.name && row.phone)
    .map(row => ({
      name: row.name,
      phone: row.phone,
      status: 'Active',
      lastAttendance: null,
      joinDate: null
    }));
  if (toInsert.length === 0) {
    return NextResponse.json({ success: false, createdCount: 0, message: 'No valid records to import.' });
  }
  const result = await Member.insertMany(toInsert);
  return NextResponse.json({ success: true, createdCount: result.length });
} 