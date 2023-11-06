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
    <>
      <div className={styles.layout}>
        <div className={styles.introLayout}>
          <div
            style={{ width: '200px', height: '200px', position: 'relative', overflow: 'hidden', borderRadius: '100px' }}
          >
            <Image
              src={avatar}
              fill={true}
              placeholder="blur"
              objectFit="cover"
              alt={'A picture of me at teamLab Tokyo'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1>
              Hey 👋 I&apos;m <span style={{ color: 'var(--colours_primary_default)' }}>Jack</span>
            </h1>
            <h2>A software engineer @ Bloomberg</h2>
          </div>
        </div>
        <div className={styles.aboutLayout}>
          <div className={styles.aboutTitle}>
            <h2>About</h2>
          </div>
          <Link
            href="/me/timeline#imperial"
            style={{
              gridArea: 'imperial',
              backgroundColor: '#EBEEEE',
              padding: 'clamp(1px, 20%, 30px)',
              borderRadius: '10px',
            }}
            className={styles.logo}
          >
            <ImperialLogo />
          </Link>
          <Link
            href="/me/timeline#bloomberg"
            style={{
              gridArea: 'bbg',
              backgroundColor: 'black',
              padding: 'clamp(1px, 20%, 30px)',
              borderRadius: '10px',
            }}
            className={styles.logo}
          >
            <BloombergLogo />
          </Link>
          <div
            style={{
              gridArea: 'skydiving',
              borderRadius: '10px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
            className={styles.skydiving}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <p>I&apos;ve skydived the equivalent of</p>
              <p className={styles.bigNumber}>{((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)}</p>
              <p> marathons 🪂</p>
            </div>
            <div id={styles.cloud}></div>
          </div>
          <Link
            href={'/me'}
            style={{
              gridArea: 'more',
              backgroundColor: 'var(--colours_primary_background_default)',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            Want to know more?
          </Link>
        </div>
        <div
          style={{
            gridArea: 'recent',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              padding: '10px',
            }}
          >
            <h2>Recent Updates</h2>
          </div>
          <div
            style={{
              backgroundColor: 'var(--colours_primary_background_default)',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            Recent tweet/retweet
          </div>
          <div
            style={{
              backgroundColor: 'var(--colours_primary_background_default)',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            Write an article about
          </div>
          <div
            style={{
              backgroundColor: 'var(--colours_primary_background_default)',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            Made x commits this month
          </div>
          <div
            style={{
              backgroundColor: 'var(--colours_primary_background_default)',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            Listened to x songs today
          </div>
        </div>
        <div
          style={{
            gridArea: 'pinned',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              padding: '10px',
            }}
          >
            <h2>Pinned</h2>
          </div>
          <Link
            href="/cv"
            style={{
              backgroundColor: 'var(--colours_primary_background_default)',
              borderRadius: '10px',
              padding: '10px',
            }}
          >
            <div style={{ width: '30px', marginLeft: '100%', translate: '0 -20px', height: '0' }}>
              <Pin />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h1>CV</h1>
              <h1>📄</h1>
            </div>
          </Link>
          {projects.map((p) => (
            <Link
              href={p.slug}
              style={{
                backgroundColor: 'var(--colours_primary_background_default)',
                borderRadius: '10px',
                padding: '10px',
              }}
              key={p.slug}
            >
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
    </>
  );
}
