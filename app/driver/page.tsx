'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Driver, Order } from '@/lib/types';
import type { OptimizedRoute, Stop } from '@/lib/route';
import { Truck, Clock, MapPin, Phone, CheckCircle2, Route, Navigation } from 'lucide-react';
import { usd, cn } from '@/lib/utils';

// Leaflet needs to be client-only (uses window).
const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-sultan-parchment animate-pulse" />
  ),
});

interface DeliveryData {
  driver: Driver;
  origin: Stop;
  orders: Order[];
  route: OptimizedRoute;
  allDrivers: Driver[];
}

export default function DriverPage() {
  const [data, setData] = useState<DeliveryData | null>(null);
  const [driverId, setDriverId] = useState('d-omar');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/delivery?driverId=${driverId}`);
    const d = await res.json();
    setData(d);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [driverId]);

  async function markDelivered(orderId: string) {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });
    load();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-sultan-emerald-900 text-sultan-cream flex items-center justify-center">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <div className="chip">Driver view</div>
          <h1 className="heading-display text-4xl text-sultan-emerald-900 mt-1">Route for today</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-sultan-ink/60">Driver:</span>
          {data?.allDrivers.map((d) => (
            <button
              key={d.id}
              onClick={() => setDriverId(d.id)}
              className={cn(
                'btn !py-2 !px-4',
                driverId === d.id ? 'btn-primary' : 'btn-ghost'
              )}
              style={driverId === d.id ? { background: d.color } : {}}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Metric label="Stops" value={data.orders.length.toString()} />
          <Metric label="Distance" value={`${data.route.totalMiles.toFixed(1)} mi`} />
          <Metric label="Est. route time" value={`${data.route.etaMinutes} min`} accent />
          <Metric label="Vehicle" value={data.driver.vehicle} />
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_420px] gap-6">
        <div className="bg-white rounded-3xl ring-1 ring-sultan-sand/60 p-4 shadow-card">
          {loading || !data ? (
            <div className="w-full h-[520px] rounded-3xl bg-sultan-parchment animate-pulse" />
          ) : (
            <DeliveryMap
              origin={data.origin}
              orders={data.orders}
              route={data.route}
              driverColor={data.driver.color}
            />
          )}
          {data && (
            <div className="flex items-center gap-2 text-xs text-sultan-ink/60 mt-3">
              <Route className="w-3.5 h-3.5" />
              Nearest-neighbor route starting and ending at the store · {data.orders.length} stops
            </div>
          )}
        </div>

        <aside className="bg-white rounded-3xl ring-1 ring-sultan-sand/60 p-4 space-y-3 max-h-[600px] overflow-y-auto">
          <div className="text-xs uppercase tracking-widest text-sultan-ink/60 px-2">
            Delivery list
          </div>
          {!data || data.orders.length === 0 ? (
            <div className="py-12 text-center text-sultan-ink/50 text-sm">
              No active deliveries right now.
            </div>
          ) : (
            data.route.stops
              .filter((s) => s.id !== 'store')
              .map((stop, idx) => {
                const order = data.orders.find((o) => o.id === stop.id);
                if (!order) return null;
                const stopIdx = data.route.stops.findIndex((s) => s.id === stop.id);
                const leg = data.route.legs[stopIdx - 1];
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-sultan-sand p-3 hover:border-sultan-emerald-300 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center shrink-0"
                        style={{ background: data.driver.color }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{order.customerName}</div>
                        <div className="text-xs text-sultan-ink/60 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </div>
                        <div className="text-xs text-sultan-ink/60 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </div>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="chip chip-emerald">{order.items.length} items</span>
                          <span className="chip">{usd(order.total)}</span>
                          {order.deliveryType === 'same-day' && (
                            <span className="chip !bg-sultan-gold-500 !text-sultan-ink">⚡</span>
                          )}
                          {leg && (
                            <span className="text-[11px] text-sultan-ink/50 inline-flex items-center gap-0.5">
                              <Navigation className="w-3 h-3" /> {leg.miles.toFixed(1)} mi from last
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-sultan-ink/60 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {order.deliveryWindow}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => markDelivered(order.id)}
                        className="btn btn-primary !py-1.5 !px-3 !text-xs flex-1 justify-center"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark delivered
                      </button>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost !py-1.5 !px-3 !text-xs"
                      >
                        Navigate
                      </a>
                    </div>
                  </div>
                );
              })
          )}
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4 ring-1',
        accent
          ? 'bg-gradient-to-br from-sultan-gold-300 to-sultan-gold-500 text-sultan-ink ring-sultan-gold-400'
          : 'bg-white ring-sultan-sand/60'
      )}
    >
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="heading-display text-2xl mt-1">{value}</div>
    </div>
  );
}
