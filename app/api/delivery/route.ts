import { NextRequest, NextResponse } from 'next/server';
import { orders, drivers } from '@/lib/repo';
import { optimizeRoute, type Stop } from '@/lib/route';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const driverId = req.nextUrl.searchParams.get('driverId') ?? 'd-omar';
  const driver = drivers.get(driverId) ?? drivers.list()[0];

  const storeLat = Number(process.env.SULTAN_STORE_LAT ?? 28.0395);
  const storeLng = Number(process.env.SULTAN_STORE_LNG ?? -82.4572);
  const origin: Stop = { id: 'store', lat: storeLat, lng: storeLng, label: 'Sultan Market' };

  const active = orders.byDriver(driver.id);
  const stops: Stop[] = active.map((o) => ({
    id: o.id,
    lat: o.lat,
    lng: o.lng,
    label: `${o.customerName} — ${o.address}`,
  }));
  const route = optimizeRoute(origin, stops);

  return NextResponse.json({
    driver,
    origin,
    orders: active,
    route,
    allDrivers: drivers.list(),
  });
}
