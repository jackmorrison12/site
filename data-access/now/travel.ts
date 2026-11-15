import 'server-only';

import { sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { tableExists } from 'data-access/feed/sources/tableExists';
import type { FlownLeg, Place, Travel } from './now.types';
import { summariseTravel } from './travelSummary';

type Row = Record<string, unknown>;

const place = (r: Row, prefix: string): Place | null =>
  r[`${prefix}_iata`] == null
    ? null
    : {
        iata: String(r[`${prefix}_iata`]),
        name: String(r[`${prefix}_name`]),
        city: String(r[`${prefix}_city`]),
        country: String(r[`${prefix}_country`]),
        lat: Number(r[`${prefix}_lat`]),
        lon: Number(r[`${prefix}_lon`]),
      };

const airportCols = (alias: string) =>
  sql.raw(['iata', 'name', 'city', 'country', 'lat', 'lon'].map((c) => `${alias}.${c} AS ${alias}_${c}`).join(', '));

/**
 * Every flight I've flown, from pulsar's `flights` table. Pulsar only ever writes
 * flights that have landed, and the query checks again, so nothing upcoming can
 * show on the public page. Returns null until pulsar creates the tables.
 */
export async function getTravel(): Promise<Travel | null> {
  if (!(await tableExists('flights')) || !(await tableExists('airports'))) return null;

  const res = await db.execute(sql`
    SELECT f.departure_date::text AS departure_date, f.carrier, f.flight_number,
           ${airportCols('o')}, ${airportCols('a')}, ${airportCols('d')}
    FROM flights f
    JOIN airports o ON o.iata = f.from_iata
    JOIN airports a ON a.iata = f.to_iata
    LEFT JOIN airports d ON d.iata = f.diverted_to
    WHERE NOT f.canceled AND COALESCE(f.arrives_at, f.departs_at) <= now()
    ORDER BY f.departs_at`);

  const legs: FlownLeg[] = [];
  for (const r of res.rows as Row[]) {
    const from = place(r, 'o');
    const to = place(r, 'd') ?? place(r, 'a');
    if (!from || !to) continue;
    legs.push({
      departureDate: String(r.departure_date),
      carrier: r.carrier == null ? null : String(r.carrier),
      flightNumber: r.flight_number == null ? null : String(r.flight_number),
      from,
      to,
    });
  }
  return legs.length ? summariseTravel(legs) : null;
}
