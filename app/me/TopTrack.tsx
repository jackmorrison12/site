import { Suspense } from 'react';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import { getTrackInfo } from '../../data-access/lastfm/api/getTrackInfo';
import styles from './me.module.scss';
import { getAlbumInfo } from '../../data-access/lastfm/api/getAlbumInfo';
import Link from 'next/link';

export const TopTrack = () => (
  <Suspense
    fallback={
      <div className={`${styles.music} ${styles.clickable} ${styles.musicLoader}`}>Loading top track this week...</div>
    }
  >
    <TopTrackAsync />
  </Suspense>
);
const TopTrackAsync = async () => {
  let topTrack = undefined;
  try {
    topTrack = (await getTopTracks({ period: '7day', limit: 1 })).toptracks.track[0];
  } catch {
    return (
      <Link href="/feed/lastfm" className={`${styles.music} ${styles.clickable} ${styles.musicLoader}`}>
        <div>Music</div>
      </Link>
    );
  }
  let source: 'track' | 'album' | 'none' = 'none';
  let trackInfo = undefined;
  let albumInfo = undefined;
  try {
    trackInfo = await getTrackInfo({ track: topTrack.name, artist: topTrack.artist.name });
    source = 'track';
  } catch {
    try {
      albumInfo = await getAlbumInfo({ album: topTrack.name, artist: topTrack.artist.name });
      source = 'album';
    } catch {
      source = 'none';
    }
  }

  const imageUrl =
    source == 'track'
      ? trackInfo?.track.album?.image.extralarge
      : source == 'album'
      ? albumInfo?.album.image.extralarge
      : '';

  return (
    <a
      className={`${styles.box} ${styles.music} ${styles.clickable} music`}
      href={trackInfo?.track.url ?? albumInfo?.album.url ?? ''}
    >
      <div className={styles.musicText}>
        {/* TODO: This is a hack to get the image into the before selector, since you can't
                  pass variables into CSS modules, and I don't want to duplicate the code
                  into a styled component */}
        <style>{`.music::before { background-image: url(${imageUrl})}`}</style>
        <p className={styles.musicTitle}>Top track this week:</p>
        <div>
          <p>{topTrack.name}</p>
          <p className={styles.musicArtist}>{topTrack.artist.name}</p>
          <p className={styles.musicListens}>{topTrack.playcount} listens</p>
        </div>
      </div>
    </a>
  );
};
