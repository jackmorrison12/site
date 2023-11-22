import avatar from 'public/img/homepage_avatar.jpeg';
import Image from 'next/image';
import styles from './home.module.scss';
import Link from 'next/link';
import { BloombergLogo, ImperialLogo } from 'components/Logos';
import { Pin } from 'components/icons/Pin';
import { getProjects } from 'content-access/projects/projects';

const PinIcon = () => (
  <div className={styles.pinIcon}>
    <Pin />
  </div>
);

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
          <PinIcon />
          <div className={styles.cvWrapper}>
            <h1>CV</h1>
            <h1>📄</h1>
          </div>
        </Link>
        {projects.map((p) => (
          <Link href={p.slug} className={styles.card} key={p.slug}>
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
