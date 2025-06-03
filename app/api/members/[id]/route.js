import Member from '@/models/Member';
import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';

export async function GET(req, { params }) {
  const { id } = params;
  await connectMongo();
  try {
    const member = await Member.findById(id).lean();
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 

export async function PATCH(req, { params }) {
  const { id } = params;
  await connectMongo();
  const body = await req.json();
  const member = await Member.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(member, { status: 200 });
}