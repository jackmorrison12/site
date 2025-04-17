import avatar from 'public/img/homepage_avatar.jpeg';
import Image from 'next/image';
import styles from './home.module.scss';
import Link from 'next/link';
import { BloombergLogo, ImperialLogo, TwitterIcon } from 'components/Logos';
import { Pin } from 'components/icons/Pin';
import { getProjects } from 'content-access/projects/projects';
import { FT_IN_MARATHON, NUM_SKYDIVES } from 'content/about-me';

const PinIcon = () => (
  <div className={styles.pinIcon}>
    <Pin />
  </div>
);

export default async function Page() {
  const projects = getProjects().filter((p) => p.onHomepage);

  return (
    <div className={styles.layout}>
      <div className={styles.introLayout}>
        <div className={styles.introImage}>
          <Image
            src={avatar}
            fill={true}
            placeholder="blur"
            objectFit="cover"
            alt={'A picture of me at teamLab Tokyo'}
          />
        </div>
        <div className={styles.introText}>
          <h1>
            Hey 👋 I&apos;m <Link href="/me">Jack</Link>
          </h1>
          <h2>A software engineer @ Bloomberg</h2>
        </div>
      </div>
      <div className={styles.aboutLayout}>
        <div className={styles.aboutTitle}>
          <h2>About</h2>
        </div>
        <Link href="/me/timeline#imperial" className={`${styles.logo} ${styles.imperial} ${styles.clickable}`}>
          <ImperialLogo />
        </Link>
        <Link href="/me/timeline#bloomberg" className={`${styles.logo} ${styles.bloomberg} ${styles.clickable}`}>
          <BloombergLogo />
        </Link>
        <div className={styles.skydiving}>
          <div className={styles.skydivingText}>
            <p>I&apos;ve skydived the equivalent of</p>
            <p className={styles.bigNumber}>{((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)}</p>
            <p> marathons 🪂</p>
          </div>
          <div id={styles.cloud}></div>
        </div>
      </div>
      <div className={styles.recent}>
        <h2 className={styles.sectionTitle}>Recent Updates</h2>
        <div className={`${styles.card}`}>
          <blockquote className="twitter-tweet" data-theme="dark">
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ minWidth: '1rem', paddingTop: '4px' }}>
                <TwitterIcon />
              </div>
              <p lang="en" dir="ltr">
                2nd year attending{' '}
                <a href="https://twitter.com/hashtag/ReactAdvanced?src=hash&amp;ref_src=twsrc%5Etfw">#ReactAdvanced</a>{' '}
                - lots of interesting talks so far &amp; can’t wait to play around with some of the tools &amp;
                technologies mentioned! <a href="https://t.co/SJGG2NOYEI">pic.twitter.com/SJGG2NOYEI</a>
              </p>
            </div>
            &mdash; Jack Morrison (@jsm_99){' '}
            <a href="https://twitter.com/jsm_99/status/1715394631817474337?ref_src=twsrc%5Etfw">October 20, 2023</a>
          </blockquote>
        </div>
        <div className={`${styles.card}`}>
          <blockquote>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ minWidth: '1rem', paddingTop: '4px' }}>
                <TwitterIcon />
              </div>
              <p lang="en" dir="ltr">
                I found this a super useful/easy to understand intro into the (simplified) implementation of RSCs -
                would defo recommend a read if you use React!{' '}
                <blockquote>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ minWidth: '1rem', paddingTop: '4px' }}>
                      <TwitterIcon />
                    </div>
                    <p lang="en" dir="ltr">
                      RSC from Scratch. Part 1: Server Components{' '}
                      <a href="https://github.com/reactwg/server-components/discussions/5">
                        https://github.com/reactwg/server-components/discussions/5
                      </a>
                    </p>
                  </div>
                  &mdash; Dan Abramov (@dan_abramov){' '}
                  <a href="https://twitter.com/dan_abramov/status/1664681506218864640">June 2, 2023</a>
                </blockquote>
              </p>
            </div>
            &mdash; Jack Morrison (@jsm_99){' '}
            <a href="https://twitter.com/jsm_99/status/1664689369867796480?ref_src=twsrc%5Etfw">June 2, 2023</a>
          </blockquote>
        </div>
      </div>
      <div className={styles.pinned}>
        <h2 className={styles.sectionTitle}>Pinned</h2>
        <Link href="/cv" className={`${styles.card} ${styles.clickable}`}>
          <PinIcon />
          <div className={styles.cvWrapper}>
            <h1>CV</h1>
            <h1>📄</h1>
          </div>
        </Link>
        {projects.map((p) => (
          <Link href={p.slug} className={`${styles.card} ${styles.clickable}`} key={p.slug}>
            <PinIcon />
            <div className={styles.projectWrapper}>
              <div className={styles.projectImage}>
                <Image alt={`${p.title} Hero Image`} src={p.heroImg} width="150" height="150" />
              </div>
              <div className={styles.projectText}>
                <h1>{p.title}</h1>
                <p>{p.description}</p>
                <div className={styles.projectTagWrapper}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.projectTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
