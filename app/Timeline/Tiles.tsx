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

/** The month's artist, with their artwork filling the tile behind the name. */
export const ArtistTile = ({
  label,
  name,
  note,
  imageUrl,
}: {
  label: string;
  name: string;
  note: string;
  imageUrl: string | null;
}) => {
  const [failed, setFailed] = useState(false);
  const cover = imageUrl && !failed;

  return (
    <div className={cx(styles.tile, styles.artistTile, styles.w2, styles.h2, cover && styles.hasCover)}>
      {cover && (
        <>
          <Image
            className={styles.artistCover}
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 48em) 50vw, 100vw"
            onError={() => setFailed(true)}
          />
          <span className={styles.artistScrim} />
        </>
      )}
      {!cover && (
        <span className={styles.artistArt}>
          <ArtistImage src="" alt={name} size={88} />
        </span>
      )}
      <span className={styles.artistText}>
        <span className={styles.textValue} title={name}>
          {name}
        </span>
        <span className={styles.note}>{note}</span>
        <span className={styles.label}>{label}</span>
      </span>
    </div>
  );
};

/** Listens per day across the month. */
export const SparkTile = ({ label, values }: { label: string; values: number[] }) => {
  if (values.length < 2) return null;

  const max = Math.max(...values, 1);
  const step = 100 / (values.length - 1);
  const points = values.map((v, i) => `${(i * step).toFixed(2)},${(24 - (v / max) * 22).toFixed(2)}`);

  return (
    <div className={cx(styles.tile, styles.w2)}>
      <span className={styles.label}>{label}</span>
      <svg className={styles.spark} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
        <polygon className={styles.sparkArea} points={`0,24 ${points.join(' ')} 100,24`} />
        <polyline className={styles.sparkLine} points={points.join(' ')} vectorEffect="non-scaling-stroke" />
      </svg>
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
