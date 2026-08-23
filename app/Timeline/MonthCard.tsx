'use client';

import { ReactNode } from 'react';
import * as motion from 'motion/react-client';
import type { MonthSummary } from 'data-access/feed/feed.types';
import { ArtistTile, HeatTile, SparkTile, StatTile, TextTile } from './Tiles';
import styles from './Timeline.module.scss';

const MAX_TILES = 7;

const hour12 = (h: number) => {
  const suffix = h < 12 ? 'am' : 'pm';
  return `${h % 12 === 0 ? 12 : h % 12}${suffix}`;
};

/**
 * The headline numbers first, then a tile for every other source that has data,
 * then whatever else is interesting. Dense grid flow closes any gaps left over.
 */
function selectTiles(m: MonthSummary): ReactNode[] {
  const { music, github, trakt } = m;

  const headline: (ReactNode | null)[] = [
    music?.topArtist ? (
      <ArtistTile
        key="artist"
        label="Top artist"
        name={music.topArtist.name}
        note={`${music.topArtist.count.toLocaleString()} plays`}
        imageUrl={music.topArtist.imageUrl}
      />
    ) : null,
    music ? <StatTile key="listens" label="Listens" value={music.listens.toLocaleString()} accent="primary" /> : null,
    music ? <StatTile key="artists" label="Artists" value={String(music.artists)} /> : null,
  ];

  const sources: (ReactNode | null)[] = [
    github ? (
      <HeatTile
        key="heat"
        label="Contributions"
        value={String(github.contributions)}
        levels={github.levels}
        offset={new Date(Date.UTC(m.year, m.month, 1)).getUTCDay()}
      />
    ) : null,
    trakt && trakt.episodes + trakt.movies > 0 ? (
      <StatTile
        key="trakt"
        label="Episodes"
        value={String(trakt.episodes)}
        note={trakt.movies ? `+ ${trakt.movies} film${trakt.movies > 1 ? 's' : ''}` : undefined}
        accent="secondary"
      />
    ) : null,
  ];

  const extras: (ReactNode | null)[] = [
    music && music.perDay.length > 1 ? <SparkTile key="spark" label="Listens per day" values={music.perDay} /> : null,
    !m.isDawn && music && music.discoveries > 0 ? (
      <StatTile key="new" label="New artists" value={String(music.discoveries)} />
    ) : null,
    music?.peakHour ? <StatTile key="hour" label="Peak hour" value={hour12(music.peakHour.hour)} /> : null,
    music?.obsession && music.obsession.count >= 20 ? (
      <TextTile
        key="obsession"
        label="On repeat"
        value={music.obsession.track}
        note={`${music.obsession.count} plays · ${music.obsession.artist}`}
        wide
      />
    ) : null,
    // Last resort, and it closes the gap on months that have fewer tiles to show.
    music ? <StatTile key="tracks" label="Tracks" value={String(music.tracks)} /> : null,
  ];

  return [...headline, ...sources, ...extras].filter(Boolean).slice(0, MAX_TILES) as ReactNode[];
}

export const MonthCard = ({ month }: { month: MonthSummary }) => (
  <motion.article
    className={styles.card}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.28, ease: [0.2, 0.8, 0.3, 1] }}
  >
    <div className={styles.head}>
      <h3 className={styles.month}>
        {month.label}
        <span className={styles.year}>{month.year}</span>
      </h3>
      {month.isCurrent && <span className={styles.soFar}>so far</span>}
      {month.music?.isRecord && <span className={styles.record}>record</span>}
    </div>

    <div className={styles.bento}>{selectTiles(month)}</div>
  </motion.article>
);
