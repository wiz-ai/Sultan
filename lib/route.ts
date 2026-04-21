// Haversine distance (miles) + nearest-neighbor route optimizer.
// Good enough for a demo over a handful of stops in Tampa.

export function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 3958.8; // miles
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export interface Stop {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface OptimizedRoute {
  stops: Stop[];
  totalMiles: number;
  etaMinutes: number; // rough estimate @ 25 mph average
  legs: { from: Stop; to: Stop; miles: number }[];
}

// Start from `origin`, visit every stop using nearest-neighbor heuristic,
// return to origin at the end.
export function optimizeRoute(
  origin: Stop,
  stops: Stop[]
): OptimizedRoute {
  const remaining = [...stops];
  const ordered: Stop[] = [];
  let current = origin;
  let totalMiles = 0;
  const legs: { from: Stop; to: Stop; miles: number }[] = [];

  while (remaining.length) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineMiles(current, remaining[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    legs.push({ from: current, to: next, miles: bestDist });
    totalMiles += bestDist;
    ordered.push(next);
    current = next;
  }

  // return leg to store
  if (ordered.length) {
    const back = haversineMiles(current, origin);
    legs.push({ from: current, to: origin, miles: back });
    totalMiles += back;
  }

  const etaMinutes = Math.round((totalMiles / 25) * 60 + ordered.length * 4);
  return { stops: [origin, ...ordered, origin], totalMiles, etaMinutes, legs };
}
