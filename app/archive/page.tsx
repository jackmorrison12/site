import { Title } from '../../components/shared/Title';
import Image from 'next/image';

import styles from './archive.module.scss';
import { archives } from 'content/archives';

export default async function Page() {
  return (
    <div className={styles.wrapper}>
      <Title value="ARCHIVE" offset="-552.58" />
      <p>I have had many previous iterations of this site, all built using different technologies</p>
      <p>I&apos;ve spent lots of time working on them all over the years, and so wanted to memorialise them here</p>
      <p>They&apos;re all available on sub-domains of this site</p>
      <p>
        Please do note, they are no longer maintained, so some backend-reliant features may no longer work (
        <a href="https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq">blame Heroku</a>)
      </p>
      <div className={styles.sitesWrapper}>
        {[...archives]
          .sort((a, b) => (a.version > b.version ? -1 : 1))
          .map((a) => (
            <div key={a.version} className={styles.site}>
              <h2>
                <a href={`https://v${a.version}.jackmorrison.xyz`}>{`v${a.version}.jackmorrison.xyz`}</a>
              </h2>
              <h3>{a.date}</h3>
              <a href={`https://v${a.version}.jackmorrison.xyz`} className={styles.imageWrapper}>
                <Image
                  src={a.imageSrc}
                  alt={`Version ${a.version} of my personal site`}
                  objectFit="cover"
                  fill={true}
                />
              </a>
              <p>{a.summary}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Archive',
  description: 'Every previous iteration of this site',
};
