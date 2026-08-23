'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArtistImage } from 'app/wrapped/components/ArtistImage';
import styles from './Timeline.module.scss';

export type Tone = 'primary' | 'secondary';

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

const tone = (t?: Tone) => (t === 'primary' ? styles.tonePrimary : t === 'secondary' ? styles.toneSecondary : undefined);

/** A single big number with its label underneath. */
export const StatTile = ({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: Tone;
}) => (
  <div className={cx(styles.tile, tone(accent))}>
    <span className={styles.statValue}>{value}</span>
    {note && <span className={styles.note}>{note}</span>}
    <span className={styles.label}>{label}</span>
  </div>
);

/** Text rather than a number — a track title, a show. */
export const TextTile = ({
  label,
  value,
  note,
  wide,
}: {
  label: string;
  value: string;
  note?: string;
  wide?: boolean;
}) => (
  <div className={cx(styles.tile, wide && styles.w2)}>
    <span className={styles.textValue} title={value}>
      {value}
    </span>
    {note && (
      <span className={styles.note} title={note}>
        {note}
      </span>
    )}
    <span className={styles.label}>{label}</span>
  </div>
);

/**
 * A square tile with artwork filling it and the title over the top — used for
 * the month's artist and its most-played track. Square because every piece of
 * artwork behind it is, so any other ratio crops it.
 */
export const ArtworkTile = ({
  label,
  title,
  note,
  imageUrl,
}: {
  label: string;
  title: string;
  note: string;
  imageUrl: string | null;
}) => {
  const [failed, setFailed] = useState(false);
  const cover = imageUrl && !failed;

  return (
    <div className={cx(styles.tile, styles.artTile, cover && styles.hasCover)}>
      {cover && (
        <>
          <Image
            className={styles.artCover}
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 48em) 25vw, 50vw"
            onError={() => setFailed(true)}
          />
          <span className={styles.artScrim} />
        </>
      )}
      {!cover && (
        <span className={styles.artFallback}>
          <ArtistImage src="" alt={title} size={72} />
        </span>
      )}
      <span className={styles.artText}>
        <span className={styles.textValue} title={title}>
          {title}
        </span>
        <span className={styles.note} title={note}>
          {note}
        </span>
        <span className={styles.label}>{label}</span>
      </span>
    </div>
  );
};

/** 1st, 2nd, 3rd, 4th — for the days at either end of the sparkline. */
const ordinal = (n: number) => {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  return `${n}${suffix}`;
};

/**
 * Listens per day across the month, with a key: the y-axis runs 0 → the month's
 * busiest day, the x-axis the 1st → the last day, so the shape has a scale.
 */
export const SparkTile = ({ label, values }: { label: string; values: number[] }) => {
  if (values.length < 2) return null;

  const max = Math.max(...values, 1);
  const step = 100 / (values.length - 1);
  const points = values.map((v, i) => `${(i * step).toFixed(2)},${(24 - (v / max) * 23).toFixed(2)}`);

  return (
    <div className={cx(styles.tile, styles.w2, styles.sparkTile)}>
      <span className={styles.label}>{label}</span>

      <span className={styles.sparkBody}>
        <span className={styles.sparkScale} aria-hidden="true">
          <span>{max}</span>
          <span>0</span>
        </span>
        <svg
          className={styles.spark}
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${label}: peak of ${max} on the busiest day`}
        >
          <polygon className={styles.sparkArea} points={`0,24 ${points.join(' ')} 100,24`} />
          <polyline className={styles.sparkLine} points={points.join(' ')} vectorEffect="non-scaling-stroke" />
          <line className={styles.sparkBase} x1="0" y1="24" x2="100" y2="24" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>

      <span className={styles.sparkFoot} aria-hidden="true">
        <span>{ordinal(1)}</span>
        <span>{ordinal(values.length)}</span>
      </span>
    </div>
  );
};

/**
 * A month of contributions, in the same 0-4 buckets GitHub shades its own with.
 * `offset` is the weekday the 1st falls on, so the columns line up as real weeks.
 */
export const HeatTile = ({
  label,
  value,
  levels,
  offset = 0,
}: {
  label: string;
  value: string;
  levels: number[];
  offset?: number;
}) => (
  <div className={cx(styles.tile, styles.w2)}>
    <span className={styles.heatWrap}>
      <span>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.label}>{label}</span>
      </span>
      <span className={styles.heat}>
        {Array.from({ length: offset }, (_, i) => (
          <span key={`pad-${i}`} className={styles.heatCell} data-empty="" />
        ))}
        {levels.map((level, i) => (
          <span key={i} className={styles.heatCell} data-level={level} />
        ))}
      </span>
    </span>
  </div>
);
