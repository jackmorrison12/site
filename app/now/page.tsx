import type { Metadata } from 'next';
import { Title } from 'components/shared/Title';
import { getNow } from 'data-access/now/getNow';
import { Listening } from './components/Listening';
import { Watching } from './components/Watching';
import { Travel } from './components/Travel';
import styles from './now.module.scss';

export const metadata: Metadata = {
  title: 'Now',
  description: "What I'm listening to, watching and where I've been flying.",
};

// Matches the data cache: the sections refresh twice a day, and the live
// "now playing" line refreshes with Last.fm's own 3 minute fetch cache.
export const revalidate = 180;

export default async function Page() {
  const { listening, watching, travel } = await getNow();

  return (
    <>
      <Title value="NOW" offset="-297.92" />
      <p className={styles.intro}>What I&apos;m up to, pulled from my scrobbles, my Trakt history and my flights.</p>
      <div className={styles.layout}>
        <Listening data={listening} />
        <Watching data={watching} />
        <Travel data={travel} />
      </div>
    </>
  );
}
