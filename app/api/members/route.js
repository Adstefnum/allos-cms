import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import Member from '@/models/Member';

export async function GET() {
  await connectMongo();
  try {
    const members = await Member.find({}).lean();
    const count = members.length;
    // Find the most recent attendance date across all members
    let latestDate = null;
    members.forEach(member => {
      if (member.attendanceHistory && member.attendanceHistory.length > 0) {
        const mostRecent = member.attendanceHistory.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
        if (!latestDate || new Date(mostRecent.date) > new Date(latestDate)) {
          latestDate = mostRecent.date;
        }
      }
    });
    // Count those present in the most recent attendance
    let presentCount = 0;
    if (latestDate) {
      presentCount = members.filter(member =>
        member.attendanceHistory &&
        member.attendanceHistory.some(a => a.date === latestDate && a.present)
      ).length;
    }
    // Count those who need follow-ups
    const followUpCount = members.filter(m => m.status === 'Needs Follow-up').length;
    return NextResponse.json({
      members,
      count,
      presentCount,
      followUpCount,
      latestAttendanceDate: latestDate
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 

export async function POST(request) {
  await connectMongo();
  try {
    const body = await request.json();
    const today = new Date().toISOString().split('T')[0];
    const memberData = {
      ...body,
      joinDate: body.joinDate || today,
      lastAttendance: body.lastAttendance || today,
      status: body.status || 'New',
      attendanceHistory: body.attendanceHistory || [
        {
          date: body.lastAttendance || today,
          present: true
        }
      ]
    };
    const member = await Member.create(memberData);
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
