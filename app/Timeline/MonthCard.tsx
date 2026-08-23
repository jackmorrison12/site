'use client';

import { ReactNode } from 'react';
import * as motion from 'motion/react-client';
import type { MonthSummary } from 'data-access/feed/feed.types';
import { ArtworkTile, HeatTile, SparkTile, StatTile } from './Tiles';
import styles from './Timeline.module.scss';

/*
  Enough to fill the grid on a full month: four rows of four, with the two square
  artwork tiles each two rows deep.
*/
const MAX_TILES = 12;

const hour12 = (h: number) => {
  const suffix = h < 12 ? 'am' : 'pm';
  return `${h % 12 === 0 ? 12 : h % 12}${suffix}`;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Order is the layout: auto-flow places these row by row into the four-column
 * grid, which puts the top artist top-left and the most-played track low and to
 * the right — they carry the same picture often enough that any two artwork
 * tiles near each other read as a duplicate. Dense flow closes whatever gap a
 * missing source leaves behind.
 */
function selectTiles(m: MonthSummary): ReactNode[] {
  const { music, github, trakt } = m;

  const tiles: (ReactNode | null)[] = [
    // Top band: the artist, two headline counts and the month's watching.
    music?.topArtist ? (
      <ArtworkTile
        key="artist"
        label="Top artist"
        title={music.topArtist.name}
        note={plural(music.topArtist.count, 'play')}
        imageUrl={music.topArtist.imageUrl}
      />
    ) : null,
    music ? <StatTile key="listens" label="Listens" value={music.listens.toLocaleString()} accent="primary" /> : null,
    music ? <StatTile key="artists" label="Artists" value={String(music.artists)} /> : null,
    trakt && trakt.episodes > 0 ? (
      <StatTile key="episodes" label="TV episodes" value={String(trakt.episodes)} accent="secondary" />
    ) : null,
    github ? (
      <HeatTile
        key="heat"
        label="GitHub contributions"
        value={String(github.contributions)}
        levels={github.levels}
        offset={new Date(Date.UTC(m.year, m.month, 1)).getUTCDay()}
      />
    ) : null,
    trakt && trakt.movies > 0 ? (
      <StatTile key="films" label="Films" value={String(trakt.movies)} accent="secondary" />
    ) : null,

    // Lower band: the track, with the rest of the month's music around it.
    !m.isDawn && music && music.discoveries > 0 ? (
      <StatTile key="new" label="New artists" value={String(music.discoveries)} />
    ) : null,
    music?.peakHour ? <StatTile key="hour" label="Peak hour" value={hour12(music.peakHour.hour)} /> : null,
    music?.obsession ? (
      <ArtworkTile
        key="obsession"
        label="Most played"
        title={music.obsession.track}
        note={`${music.obsession.artist} · ${plural(music.obsession.count, 'play')}`}
        imageUrl={music.obsession.imageUrl}
      />
    ) : null,
    // Last resorts, and they close the gaps on months that have fewer tiles.
    music ? <StatTile key="tracks" label="Tracks" value={String(music.tracks)} /> : null,
    music && music.perDay.length > 1 ? <SparkTile key="spark" label="Listens per day" values={music.perDay} /> : null,
    github ? <StatTile key="activeDays" label="Days on GitHub" value={String(github.activeDays)} /> : null,
  ];

  return tiles.filter(Boolean).slice(0, MAX_TILES) as ReactNode[];
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
