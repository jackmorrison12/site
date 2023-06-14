import { Suspense } from 'react';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import { getTrackInfo } from '../../data-access/lastfm/api/getTrackInfo';
import styles from './me.module.scss';

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
  const topTrack = (await getTopTracks({ period: '7day', limit: 1 })).toptracks.track[0];
  const trackInfo = await getTrackInfo({ track: topTrack.name, artist: topTrack.artist.name });

  return (
    <a className={`${styles.box} ${styles.music} ${styles.clickable} music`}>
      <div className={styles.musicText}>
        {/* TODO: This is a hack to get the image into the before selector, since you can't
                  pass variables into CSS modules, and I don't want to duplicate the code
                  into a styles component */}
        <style>{`.music::before { background-image: url(${trackInfo.track.album.image.extralarge})}`}</style>
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
