import type { FlownLeg, Place, Route, Travel, VisitedPlace } from './now.types';

const EARTH_RADIUS_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two airports. */
export function distanceKm(a: Place, b: Place): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Turns flown legs (oldest first) into what the travel section shows. Routes are
 * undirected, so JFK→LHR and LHR→JFK draw as one line with a count of two.
 */
export function summariseTravel(legs: FlownLeg[]): Travel {
  const routes = new Map<string, Route>();
  const places = new Map<string, VisitedPlace>();
  const years = new Map<number, number>();
  let distance = 0;

  const visit = (place: Place, date: string) => {
    const seen = places.get(place.iata);
    if (seen) {
      seen.visits += 1;
      if (date > seen.lastVisit) seen.lastVisit = date;
    } else {
      places.set(place.iata, { ...place, visits: 1, lastVisit: date });
    }
  };

  for (const leg of legs) {
    if (leg.from.iata === leg.to.iata) continue;
    const key = [leg.from.iata, leg.to.iata].sort().join('-');
    const route = routes.get(key);
    if (route) route.count += 1;
    else routes.set(key, { from: leg.from, to: leg.to, count: 1 });

    visit(leg.from, leg.departureDate);
    visit(leg.to, leg.departureDate);
    distance += distanceKm(leg.from, leg.to);

    const year = Number(leg.departureDate.slice(0, 4));
    years.set(year, (years.get(year) ?? 0) + 1);
  }

  const placeList = [...places.values()];
  const byYear = [...years.entries()].sort(([a], [b]) => a - b).map(([year, flights]) => ({ year, flights }));

  return {
    flights: legs.length,
    distanceKm: Math.round(distance),
    countries: [...new Set(placeList.map((p) => p.country))].sort(),
    cities: new Set(placeList.map((p) => `${p.city}|${p.country}`)).size,
    firstYear: byYear[0]?.year ?? null,
    // Busiest routes last, so they paint on top.
    routes: [...routes.values()].sort((a, b) => a.count - b.count),
    places: placeList.sort((a, b) => a.visits - b.visits),
    lastFlight: legs[legs.length - 1] ?? null,
    byYear,
  };
}
