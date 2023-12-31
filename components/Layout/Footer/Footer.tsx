import Link from 'next/link';
import React from 'react';

import styles from './Footer.module.css';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '../../Logos';
import { socials } from 'content/about-me';

const Footer = () => (
  <footer>
    <div className={styles.footer}>
      <div className={styles.intro}>
        <h3>A quick disclaimer...</h3>
        <p>
          I&apos;m a software engineer at Bloomberg. All views expressed on this site are my own, and do not represent
          my employer.
        </p>
      </div>
      <div className={styles.useful}>
        <h4>Fun(ish) Things</h4>
        <div className={styles.linksWrapper}>
          <Link href="/credits" passHref className={styles.link}>
            <p>Credits</p>
          </Link>
          <Link href="/tools" passHref className={styles.link}>
            <p>Tools Used</p>
          </Link>
          <Link href="/archive" passHref className={styles.link}>
            <p>Site Archive</p>
          </Link>
        </div>
      </div>
      <div className={styles.popular}>
        <h4>Popular</h4>
        {/* Generate these from analytics on build*/}
        <div className={styles.linksWrapper}>
          <Link href="/cv" passHref className={styles.link}>
            <p>CV</p>
          </Link>
          <Link href="/projects/osti" passHref className={styles.link}>
            <p>Osti</p>
          </Link>
          <Link href="/projects/canvas" passHref className={styles.link}>
            <p>Canvas</p>
          </Link>
          <Link href="/me/timeline" passHref className={styles.link}>
            <p>Timeline</p>
          </Link>
        </div>
      </div>
      <div className={styles.socials}>
        <h4>Socials</h4>
        <div className={styles.iconGrid}>
          <a href={socials.twitter.url} className={styles.icon}>
            <TwitterIcon />
          </a>
          <a href={socials.linkedin.url} className={styles.icon}>
            <LinkedInIcon />
          </a>
          <a href={socials.github.url} className={styles.icon}>
            <GitHubIcon />
          </a>
          <a href={socials.instagram.url} className={styles.icon}>
            <InstagramIcon />
          </a>
        </div>
      </div>
      <div className={styles.disclaimer}>© {new Date().getFullYear()} Jack Morrison</div>
    </div>
  </footer>
);

export default Footer;
