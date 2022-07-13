import Link from 'next/link';
import React from 'react';

import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.intro}>
      <h3>Hey, I&apos;m Jack 👋</h3>
      <p>
        Congrats, you&apos;ve made it all the way down to the bottom 🎉 Down here you can find all of those fun easter
        egg links, as well as the boring ones every site has. I&apos;ve also picked out some of the ones people find
        most popular.
      </p>
    </div>
    <div className={styles.useful}>
      <h4>Useful</h4>
      <Link href="/credits">
        <a>
          <p>Credits</p>
        </a>
      </Link>
      <Link href="/tools">
        <a>
          <p>Tools Used</p>
        </a>
      </Link>
      <Link href="/fair-use">
        <a>
          <p>Fair Use Policy</p>
        </a>
      </Link>
      <Link href="/archive">
        <a>
          <p>Site Archive</p>
        </a>
      </Link>
    </div>
    <div className={styles.popular}>
      <h4>Popular</h4>
      {/* Generate these from analytics on build*/}
      <p>Live</p>
      <p>Long Article Title 1</p>
      <p>Something else people seem to like</p>
      <p>Cool project I worked on</p>
    </div>
    <div className={styles.socials}>
      <h4>Please talk to me</h4>
    </div>
    <div className={styles.disclaimer}>© {new Date().getFullYear()} Jack Morrison</div>
  </footer>
);

export default Footer;
