'use client';
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import type { OptimizedRoute, Stop } from '@/lib/route';
import type { Order } from '@/lib/types';

// Fix Leaflet marker asset paths in Next.js (uses CDN icons)
const defaultIcon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function numberedIcon(n: number, color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      color:#faf5ec;
      width:32px;height:32px;border-radius:999px;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:14px;
      box-shadow:0 4px 12px rgba(0,0,0,.25);
      border:2px solid rgba(255,255,255,.6);
    ">${n}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function DeliveryMap({
  origin,
  orders,
  route,
  driverColor,
}: {
  origin: Stop;
  orders: Order[];
  route: OptimizedRoute;
  driverColor: string;
}) {
  const polylinePoints: [number, number][] = route.stops.map((s) => [s.lat, s.lng]);

  return (
    <MapContainer
      center={[origin.lat, origin.lng]}
      zoom={11}
      className="w-full h-[520px] rounded-3xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline
        pathOptions={{ color: driverColor, weight: 4, opacity: 0.9, dashArray: '8 6' }}
        positions={polylinePoints}
      />

      <CircleMarker
        center={[origin.lat, origin.lng]}
        radius={14}
        pathOptions={{ color: '#0f2e24', fillColor: '#d49a1e', fillOpacity: 1 }}
      >
        <Popup>
          <strong>Sultan Market</strong>
          <br />5010 E Busch Blvd, Tampa
        </Popup>
      </CircleMarker>

      {orders.map((o, i) => {
        // stop index in the optimized order
        const idx = route.stops.findIndex((s) => s.id === o.id);
        const displayIdx = idx > 0 ? idx : i + 1;
        return (
          <Marker
            key={o.id}
            position={[o.lat, o.lng]}
            icon={numberedIcon(displayIdx, driverColor)}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>Stop #{displayIdx} — {o.customerName}</strong>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{o.address}</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>
                  {o.items.length} items · ${o.total.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, marginTop: 4, color: '#555' }}>
                  Window: {o.deliveryWindow}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
