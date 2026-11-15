import { geoContains, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import countriesTopo from 'world-atlas/countries-110m.json';
import type { Route, VisitedPlace } from 'data-access/now/now.types';
import styles from './WorldMap.module.scss';

const WIDTH = 960;
const HEIGHT = 470;
const ANTARCTICA = '010';

const topology = countriesTopo as unknown as Topology<{ countries: GeometryCollection }>;
const allCountries = feature(topology, topology.objects.countries) as FeatureCollection<Geometry>;
const countries: FeatureCollection<Geometry> = {
  type: 'FeatureCollection',
  features: allCountries.features.filter((f) => f.id !== ANTARCTICA),
};

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], countries);
const path = geoPath(projection).digits(1);

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * A static world map of every route I've flown and every airport city I've been
 * to. Drawn entirely on the server: no map library ships to the browser, and the
 * tooltips are plain SVG titles.
 */
export function WorldMap({ routes, places }: { routes: Route[]; places: VisitedPlace[] }) {
  const visited = (country: Feature<Geometry>) => places.some((p) => geoContains(country, [p.lon, p.lat]));

  return (
    <svg
      className={styles.map}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Map of the flights I've taken"
    >
      <g>
        {countries.features.map((c, i) => (
          <path
            key={String(c.id ?? i)}
            d={path(c) ?? undefined}
            className={visited(c) ? `${styles.country} ${styles.visited}` : styles.country}
          />
        ))}
      </g>
      <g className={styles.routes}>
        {routes.map((r) => (
          <path
            key={`${r.from.iata}-${r.to.iata}`}
            d={
              path({
                type: 'LineString',
                coordinates: [
                  [r.from.lon, r.from.lat],
                  [r.to.lon, r.to.lat],
                ],
              }) ?? undefined
            }
            className={styles.route}
            strokeWidth={Math.min(3.5, 0.8 + Math.log2(r.count) * 0.6)}
          >
            <title>{`${r.from.city} ↔ ${r.to.city}: ${plural(r.count, 'flight')}`}</title>
          </path>
        ))}
      </g>
      <g>
        {places.map((p) => {
          const xy = projection([p.lon, p.lat]);
          if (!xy) return null;
          return (
            <circle
              key={p.iata}
              cx={xy[0].toFixed(1)}
              cy={xy[1].toFixed(1)}
              r={Math.min(7, 2.5 + Math.sqrt(p.visits) * 0.5).toFixed(1)}
              className={styles.place}
            >
              <title>{`${p.city} (${p.iata}): ${plural(p.visits, 'visit')}`}</title>
            </circle>
          );
        })}
      </g>
    </svg>
  );
}
