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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectMongo();
  const { id } = params;
  try {
    await Member.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  await connectMongo();
  try {
    const body = await req.json();
    const member = await Member.findByIdAndUpdate(id, body, { new: true });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}