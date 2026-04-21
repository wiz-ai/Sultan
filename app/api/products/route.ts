import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/repo';
import type { Product } from '@/lib/types';
import { randomId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  const category = req.nextUrl.searchParams.get('category');
  let list = products.list();
  if (category) list = list.filter((p) => p.category === category);
  if (q) list = products.search(q);
  return NextResponse.json({ products: list });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Product>;
  if (!body.name || !body.category || body.price === undefined) {
    return NextResponse.json({ error: 'name, category, price required' }, { status: 400 });
  }
  const p: Product = {
    id: body.id || `p-${randomId('').slice(0, 8)}`,
    name: body.name,
    nameAr: body.nameAr,
    description: body.description || '',
    category: body.category as any,
    subcategory: body.subcategory,
    price: Number(body.price),
    unit: body.unit || 'each',
    stock: body.stock ?? 0,
    badges: body.badges ?? [],
    emoji: body.emoji || '🛒',
    gradient: body.gradient || 'from-sultan-emerald-500 to-sultan-emerald-800',
    origin: body.origin,
  };
  return NextResponse.json({ product: products.upsert(p) });
}
