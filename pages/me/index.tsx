// import { GetStaticProps } from 'next';
import Image from 'next/legacy/image';

import styles from './index.module.scss';

import { Layout } from '../../components/Layout';
import { useState } from 'react';
import TextWrapper from '../../components/Layout/TextWrapper/TextWrapper';
import avatar from '../../content/about-me/avatar.jpg';
import { Title } from '../../components/shared/Title';

function importAll(r: __WebpackModuleApi.RequireContext): any {
  return r.keys().map(r);
}

const images: StaticImageData[] = importAll(require.context('../../content/about-me/img', false, /\.jpeg$/));

const MePage = () => {
  const NUM_SKYDIVES = 23;
  const NUM_COUNTRIES = 27;
  const NUM_OS = 2;
  const FT_IN_MARATHON = 138336;
  enum BioLength {
    short = 'SHORT',
    medium = 'MEDIUM',
    long = 'LONG',
  }
  const [bioLength, setBioLength] = useState(BioLength.short);
  return (
    <Layout title="Me">
      <Title value="ME" offset="-757.2" bgOverride="ABOUTME" />
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: '0 1 auto',
          flexWrap: 'wrap',
          // opacity: '0.4',
          gridColumn: 'full',
          // marginTop: '-10px',
        }}
      >
        {images.slice(0, 6).map((i: StaticImageData) => (
          <div style={{ flexBasis: '16.66667%', maxWidth: '16.66667%', flexGrow: 0, flexShrink: 0, display: 'flex' }}>
            <Image src={i} width="800" height="800" objectFit="cover" />
          </div>
        ))}
      </div> */}
      {/* <div>
        <button onClick={() => setBioLength(BioLength.short)}>short</button>
        <button onClick={() => setBioLength(BioLength.medium)}>medium</button>
        <button onClick={() => setBioLength(BioLength.long)}>long</button>
      </div> */}

      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: '0 1 auto',
          flexWrap: 'wrap',
          // opacity: '0.4',
          gridColumn: 'full',
          marginTop: '-10px',
        }}
      >
        {images.slice(0, 12).map((i: StaticImageData) => (
          <div style={{ flexBasis: '8.333334%', maxWidth: '8.333334%', flexGrow: 0, flexShrink: 0, display: 'flex' }}>
            <Image src={i} width="800" height="800" objectFit="cover" />
          </div>
        ))}
      </div> */}
      <div className={styles.hero}>
        <div>
          <p className={styles.heroTitle}>Hey, I&apos;m Jack 👋</p>
          <p>How much are you interested?</p>
          <input
            type="range"
            style={{ width: '100%' }}
            min={0}
            max={2}
            defaultValue={0}
            onChange={(e) =>
              setBioLength(
                e.target.value === '0' ? BioLength.short : e.target.value === '1' ? BioLength.medium : BioLength.long,
              )
            }
          />
        </div>
        <div className={styles.heroImage}>
          <Image src={avatar} width="800" height="800" placeholder="blur" />
        </div>
      </div>
      <TextWrapper>
        {bioLength === BioLength.short && (
          <>
            <p className={styles.summary}>
              I&apos;m a Software Engineer at Bloomberg in London. I&apos;m an Imperial College London alumni. I enjoy
              making music, travelling, and skydiving.
            </p>
            <p className={styles.subtitle}>Here are some fun facts about me:</p>
          </>
        )}
        {bioLength === BioLength.medium && (
          <>
            <p className={styles.summary}>
              Hey, I&apos;m Jack. I&apos;m currently working as a Software Engineer at Bloomberg in London, working on
              their Web and API enterprise data product: DATA {'<GO>'}.
            </p>
            <p className={styles.summary}>
              I graduated from Imperial College London back in 2021. I did my Master&apos;s dissertation on
              personalised, context-aware music recommendation systems.
            </p>
            <p className={styles.summary}>
              In my free time, I enjoy skydiving. I started learning back in 2019 and so far have completed{' '}
              {NUM_SKYDIVES} jumps! I also enjoy travelling - I&apos;ve been to {NUM_COUNTRIES} countries so far. I also
              like to play around making music. I also play the piano, and so enjoy combining these.
            </p>
            <p className={styles.subtitle}>Here are some fun facts about me:</p>
          </>
        )}
        {bioLength === BioLength.long && (
          <>
            <p className={styles.summary}>
              Hey, I&apos;m Jack. I&apos;m currently working as a Software Engineer at Bloomberg in London, working on
              their Web and API enterprise data product: DATA {'<GO>'}. This is a full stack application, so I get to
              work with a range of technologies and languages, mainly Python, React and TypeScript.
            </p>
            <p className={styles.summary}>
              I graduated from Imperial College London back in 2021. I had a great time, getting to work on a lot of fun
              projects, from designing and building an operating system and programming language, to creating a
              life-size arcade machine for the game Snake. I also worked on a project researching CRDTs, and completed
              my Master&apos;s dissertation on personalised, context-aware music recommendation systems. I was also the
              Secretary of the Skydiving society from 2020-2021.
            </p>
            <p className={styles.summary}>
              In my free time, I enjoy skydiving. I started learning back in 2019 and so far have completed{' '}
              {NUM_SKYDIVES} jumps! I also enjoy travelling - I&apos;ve been to {NUM_COUNTRIES} countries so far. I also
              like to play around making music. I also play the piano, and so enjoy combining these. I&apos;ve played
              around with Logic Pro and Cubase.
            </p>
            <p className={styles.subtitle}>Here are some fun facts about me:</p>
          </>
        )}
        <div className={styles.factsWrapper}>
          <div className={styles.fact}>
            I&apos;ve fallen the equivalent of {((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)} marathons 🪂
          </div>
          <div className={styles.fact}>I&apos;ve travelled to {NUM_COUNTRIES} countries ✈️</div>
          <div className={styles.fact}>I&apos;ve contributed to {NUM_OS} open source projects (so far...) 👨‍💻</div>
        </div>
      </TextWrapper>
      <div className={styles.imageGrid}>
        {images.slice(0, 12).map((i: StaticImageData) => (
          <div key={i.src} className={styles.image}>
            <Image src={i} width="800" height="800" objectFit="cover" placeholder="blur" />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default MePage;
