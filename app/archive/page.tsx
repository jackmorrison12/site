import { Title } from '../../components/shared/Title';
import Image from 'next/image';

import styles from './archive.module.scss';

import v0 from 'public/img/archive/v0.png';
import v1 from 'public/img/archive/v1.png';
import v2 from 'public/img/archive/v2.png';
import v3 from 'public/img/archive/v3.png';
import v4 from 'public/img/archive/v4.png';

export default async function Page() {
  const archives = [
    {
      version: 0,
      date: '2015-2017',
      imageSrc: v0,
      summary:
        'I created a website back in Sixth Form as part of a lesson about HTML. It was never hosted anywhere, so I classed it as a v0.',
    },
    {
      version: 1,
      date: '2017-2018',
      imageSrc: v1,
      summary: 'The first site I published was static HTML and CSS, and was hosted using GitHub Pages.',
    },
    {
      version: 2,
      date: '2018-2020',
      imageSrc: v2,
      summary:
        'The second generation was made using Jekyll, and converted my old design into something more sustainable.',
    },
    {
      version: 3,
      date: '2020',
      imageSrc: v3,
      summary:
        'Version 3 of my site was created using React, and compiled using a GitHub Action, also hosted using GitHub Pages.',
    },
    {
      version: 4,
      date: '2020-2023',
      imageSrc: v4,
      summary:
        'The previous iteration of this site used Gatsby on the frontend, hosted using Netlify. The backend was an Express server hosted on Heroku.',
    },
  ];

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
        {archives
          .sort((a, b) => (a.version > b.version ? -1 : 1))
          .map((a) => (
            <div key={a.version} className={styles.site}>
              <h2>
                <a href={`https://v${a.version}.jackmorrison.xyz`}>{`v${a.version}.jackmorrison.xyz`}</a> - {a.date}
              </h2>
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
