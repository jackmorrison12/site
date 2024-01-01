import { formatInTimeZone } from 'date-fns-tz';

import styles from './lastfm.module.scss';

export default async function Page() {
  const timezone = formatInTimeZone(new Date(), 'Europe/London', 'z') === 'GMT' ? 'GMT' : 'BST';

  return (
    <>
      <h1>
        Recent LastFM Activity
        <span className={styles.timezone}>in {timezone}</span>
      </h1>
    </>
  );
}

export const metadata = {
  title: 'LastFM',
  description: 'My recent LastFM activity',
};
