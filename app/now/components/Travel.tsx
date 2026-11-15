import type { Travel as TravelData } from 'data-access/now/now.types';
import { countryName, flag, plural, shortDate } from '../format';
import { WorldMap } from './WorldMap';
import styles from '../now.module.scss';

const EARTH_CIRCUMFERENCE_KM = 40075;

export function Travel({ data }: { data: TravelData | null }) {
  if (!data) {
    return (
      <section className={`${styles.card} ${styles.travel}`}>
        <h2 className={styles.heading}>Travel</h2>
        <p className={styles.summary}>My flights map is on its way.</p>
      </section>
    );
  }

  const last = data.lastFlight;
  const laps = data.distanceKm / EARTH_CIRCUMFERENCE_KM;

  return (
    <section className={`${styles.card} ${styles.travel}`}>
      <h2 className={styles.heading}>Travel</h2>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.flights.toLocaleString()}</span>
          <span className={styles.statLabel}>flights{data.firstYear ? ` since ${data.firstYear}` : ''}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.distanceKm.toLocaleString()} km</span>
          <span className={styles.statLabel}>{laps >= 1 ? `${laps.toFixed(1)} times round the Earth` : 'flown'}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.countries.length}</span>
          <span className={styles.statLabel}>countries</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.cities}</span>
          <span className={styles.statLabel}>cities</span>
        </div>
      </div>

      <WorldMap routes={data.routes} places={data.places} />

      {last && (
        <p className={styles.summary}>
          Most recently {last.from.city} to {last.to.city}
          {last.carrier && last.flightNumber ? ` on ${last.carrier} ${last.flightNumber}` : ''},{' '}
          {shortDate(last.departureDate)}.
        </p>
      )}
      <ul className={styles.countries}>
        {data.countries.map((c) => (
          <li key={c} title={countryName(c)}>
            <span aria-hidden>{flag(c)}</span> {countryName(c)}
          </li>
        ))}
      </ul>
      <p className={styles.footnote}>{plural(data.routes.length, 'route')}. Past flights only, from Flighty.</p>
    </section>
  );
}
