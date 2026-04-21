import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/lib/repo';
import { computeTotals } from '@/lib/pricing';
import type { OrderItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Tiny Tampa-area geocoder for the demo. Real deployment: use Google
// Geocoding API or Mapbox. This just jitters around the store so the map
// renders meaningfully without a network call.
function fakeGeocode(address: string) {
  const storeLat = Number(process.env.SULTAN_STORE_LAT ?? 28.0395);
  const storeLng = Number(process.env.SULTAN_STORE_LNG ?? -82.4572);
  let hash = 0;
  for (let i = 0; i < address.length; i++) hash = (hash * 31 + address.charCodeAt(i)) | 0;
  const dLat = (((hash & 0xffff) / 0xffff) - 0.5) * 0.12; // ~8km
  const dLng = ((((hash >> 16) & 0xffff) / 0xffff) - 0.5) * 0.12;
  return { lat: storeLat + dLat, lng: storeLng + dLng };
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const driverId = req.nextUrl.searchParams.get('driverId');
  if (userId) return NextResponse.json({ orders: orders.byUser(userId) });
  if (driverId) return NextResponse.json({ orders: orders.byDriver(driverId) });
  return NextResponse.json({ orders: orders.list() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: OrderItem[] = body.items ?? [];
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const totals = computeTotals(subtotal, body.deliveryType ?? 'next-day', body.priority === true);
  const { lat, lng } = fakeGeocode(body.address ?? '');
  const created = orders.create({
    userId: body.userId ?? 'u-demo',
    customerName: body.customerName ?? 'Customer',
    phone: body.phone ?? '',
    address: body.address ?? '',
    lat,
    lng,
    items,
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    total: totals.total,
    deliveryType: body.deliveryType ?? 'next-day',
    deliveryWindow: body.deliveryWindow ?? 'Tomorrow, 9am–12pm',
    notes: body.notes,
    driverId: null,
    status: 'confirmed',
  });
  return NextResponse.json({ order: created });
}
