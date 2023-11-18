import avatar from 'public/img/homepage_avatar.jpeg';
import Image from 'next/image';
import styles from './home.module.scss';
import Link from 'next/link';
import { BloombergLogo, ImperialLogo } from 'components/Logos';
import { Pin } from 'components/icons/Pin';
import { getProjects } from 'content-access/projects/projects';

export default async function Page() {
  const NUM_SKYDIVES = 23;
  const FT_IN_MARATHON = 138336;

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
            Hey 👋 I&apos;m <span className={styles.textHighlight}>Jack</span>
          </h1>
          <h2>A software engineer @ Bloomberg</h2>
        </div>
      </div>
      <div className={styles.aboutLayout}>
        <div className={styles.aboutTitle}>
          <h2>About</h2>
        </div>
        <Link href="/me/timeline#imperial" className={`${styles.logo} ${styles.imperial}`}>
          <ImperialLogo />
        </Link>
        <Link href="/me/timeline#bloomberg" className={`${styles.logo} ${styles.bloomberg}`}>
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
        <Link href={'/me'} className={styles.aboutMore}>
          Want to know more?
        </Link>
      </div>
      <div className={styles.recent}>
        <h2 className={styles.sectionTitle}>Recent Updates</h2>
        <div className={styles.card}>Recent tweet/retweet</div>
        <div className={styles.card}>Write an article about</div>
        <div className={styles.card}>Made x commits this month</div>
        <div className={styles.card}>Listened to x songs today</div>
      </div>
      <div className={styles.pinned}>
        <h2 className={styles.sectionTitle}>Pinned</h2>
        <Link href="/cv" className={styles.card}>
          <div style={{ width: '30px', marginLeft: '100%', translate: '0 -20px', height: '0' }}>
            <Pin />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>CV</h1>
            <h1>📄</h1>
          </div>
        </Link>
        {projects.map((p) => (
          <Link href={p.slug} className={styles.card} key={p.slug}>
            <div style={{ width: '30px', marginLeft: '100%', translate: '0 -20px', height: '0' }}>
              <Pin />
            </div>
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '150px auto' }}>
              <div
                style={{ borderRadius: '10px', overflow: 'hidden', width: '150px', height: '150px', margin: 'auto' }}
              >
                <Image alt={`${p.title} Hero Image`} src={p.heroImg} width="150" height="150" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1>{p.title}</h1>
                <p>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '10px 0' }}>
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        borderRadius: '5px',
                        padding: '2px 5px',
                        backgroundColor: 'var(--colours_primary_default)',
                        color: 'var(--colours_legacyGrey_1)',
                      }}
                    >
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
