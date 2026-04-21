import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/repo';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const p = products.get(params.id);
  if (!p) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ product: p });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const existing = products.get(params.id);
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const patch = await req.json();
  const updated = { ...existing, ...patch, id: params.id };
  return NextResponse.json({ product: products.upsert(updated) });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  products.remove(params.id);
  return NextResponse.json({ ok: true });
}
