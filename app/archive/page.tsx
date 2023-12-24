import { Title } from '../../components/shared/Title';
import Image from 'next/image';

import v0 from 'public/img/archive/v0.png';
import v1 from 'public/img/archive/v1.png';
import v2 from 'public/img/archive/v2.png';
import v3 from 'public/img/archive/v3.png';
import v4 from 'public/img/archive/v4.png';

export default async function Page() {
  const archives = [
    {
      version: 0,
      imageSrc: v0,
      summary:
        'I created a website back in Sixth Form as part of a lesson about HTML. It was never hosted anywhere, so I classed it as a v0.',
    },
    {
      version: 1,
      imageSrc: v1,
      summary: 'The first site I published was static HTML and CSS, and was hosted using GitHub Pages.',
    },
    {
      version: 2,
      imageSrc: v2,
      summary:
        'The second generation was made using Jekyll, and converted my old design into something more sustainable.',
    },
    {
      version: 3,
      imageSrc: v3,
      summary:
        'Version 3 of my site was created using React, and compiled using a GitHub Action, also hosted using GitHub Pages.',
    },
    {
      version: 4,
      imageSrc: v4,
      summary:
        'The previous iteration of this site used Gatsby on the frontend, hosted using Netlify. The backend was an Express server hosted on Heroku.',
    },
  ];

  return (
    <>
      <Title value="ARCHIVE" offset="-552.58" />
      <p>I have had many previous iterations of this site</p>{' '}
      <p>I&apos;ve spent lots of time working on them all over the years, and so wanted to memorialise them all here</p>
      <p>They&apos;re all available on sub-domains of this site, hosted using GitHub Pages</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', paddingTop: '20px' }}>
        {archives.map((a) => (
          <div
            key={a.version}
            style={{ width: 'calc(50% - 40px)', display: 'flex', gap: '20px', flexDirection: 'column' }}
          >
            <a
              href={`https://v${a.version}.jackmorrison.xyz`}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '1.6',
                position: 'relative',
              }}
            >
              <Image src={a.imageSrc} alt={`Version ${a.version} of my personal site`} objectFit="cover" fill={true} />
            </a>
            <p>{a.summary}</p>
            <p>
              Available at <a href={`https://v${a.version}.jackmorrison.xyz`}>{`v${a.version}.jackmorrison.xyz`}</a>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export const metadata = {
  title: 'Archive',
  description: 'Every previous iteration of this site',
};
