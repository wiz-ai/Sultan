import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/lib/repo';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const o = orders.get(params.id);
  if (!o) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ order: o });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  let updated = orders.get(params.id);
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (body.status) updated = orders.updateStatus(params.id, body.status);
  if (body.driverId !== undefined) updated = orders.assignDriver(params.id, body.driverId);
  return NextResponse.json({ order: updated });
}
