import connectMongo from './mongoose';
import Member from '@/models/Member';

export async function updateData() {
  await connectMongo();
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Get last Sunday
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  lastSunday.setHours(0, 0, 0, 0);

  const members = await Member.find({});
  for (const member of members) {
    const joinDate = member.joinDate ? new Date(member.joinDate) : null;
    const isNew = joinDate && (now - joinDate) / (1000 * 60 * 60 * 24) <= 31;
    let lastAttendance = null;
    if (member.attendanceHistory && member.attendanceHistory.length > 0) {
      lastAttendance = member.attendanceHistory
        .map(a => new Date(a.date))
        .sort((a, b) => b - a)[0];
    }
    let lastFollowUp = null;
    if (member.notes && member.notes.length > 0) {
      lastFollowUp = member.notes
        .map(n => new Date(n.date))
        .sort((a, b) => b - a)[0];
    }
    // 1. If the member didn't attend last Sunday, mark as needs_follow_up.
    let attendedLastSunday = false;
    if (member.attendanceHistory && member.attendanceHistory.length > 0) {
      attendedLastSunday = member.attendanceHistory.some(a => {
        const attDate = new Date(a.date);
        return attDate.toDateString() === lastSunday.toDateString() && a.present;
      });
    }
    // 2. If new member (joined within 1 month):
    if (isNew) {
      member.status = 'New';
    } else {
      // 3. Existing members (joined > 1 month ago):
      // If >1 month since last follow-up or last attendance, mark as needs_follow_up
      const lastAction = [lastAttendance, lastFollowUp].filter(Boolean).sort((a, b) => b - a)[0];
      if (!attendedLastSunday) {
        member.status = 'Needs Follow-up';
      } else if (!lastAction || lastAction < oneMonthAgo) {
        member.status = 'Needs Follow-up';
      } else {
        member.status = 'Active';
      }
    }
    await member.save();
  }
} 