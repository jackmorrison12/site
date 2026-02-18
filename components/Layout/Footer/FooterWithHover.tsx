'use client';

import Link from 'next/link';
import React from 'react';
import styles from './Footer.module.css';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '../../Logos';
import { socials } from 'content/about-me';

const hoverStyle: React.CSSProperties = {
  width: '40px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, color 0.3s ease',
};

const AnimatedIcon = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={href}
      style={{
        ...hoverStyle,
        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        color: isHovered ? 'var(--colours_primary_default)' : 'inherit',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
};

const FooterWithHover = () => (
  <footer>
    <div className={styles.footer}>
      <div className={styles.intro}>
        <h3>A quick disclaimer...</h3>
        <p>
          I&apos;m a software engineer at Bloomberg. All views expressed on this site are my own, and do not represent my employer.
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
          <AnimatedIcon href={socials.twitter.url}>
            <TwitterIcon />
          </AnimatedIcon>
          <AnimatedIcon href={socials.linkedin.url}>
            <LinkedInIcon />
          </AnimatedIcon>
          <AnimatedIcon href={socials.github.url}>
            <GitHubIcon />
          </AnimatedIcon>
          <AnimatedIcon href={socials.instagram.url}>
            <InstagramIcon />
          </AnimatedIcon>
        </div>
      </div>
      <div className={styles.disclaimer}>© {new Date().getFullYear()} Jack Morrison</div>
    </div>
  </footer>
);

export default FooterWithHover;
