import Link from 'next/link';
import { Title } from '../../components/shared/Title';
import { GitHubIcon } from '../me/logos/github';
import { Heatmap } from './Heatmap';
import { useHeatmap } from './Heatmap.hooks';
import styles from './feed.module.scss';

export default async function Page() {
  const { data, xLabels, yLabels } = await useHeatmap();

  return (
    <>
      <Title value="FEED" offset="-310.76" />
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h1>Recent Activity</h1>
          <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
          </ul>
        </div>
        <div className={styles.sidebar}>
          <Link passHref href="/feed/github">
            <div
              className={styles.github}
              style={{
                backgroundColor: 'var(--colours_secondary_default)',
                width: 'fit-content',
                padding: '20px',
                borderRadius: '10px',
                color: 'var(--colours_text_default)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                  paddingBottom: '10px',
                }}
              >
                <div style={{ width: '30px' }}>
                  <GitHubIcon />
                </div>
                <h3>Recent Activity</h3>
              </div>
              <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} />
            </div>
          </Link>
          <div className={styles.lastfm}>LastFM Activity</div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Feed',
  description: "What I've been getting up to recently",
};
