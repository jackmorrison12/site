'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './Footer.module.css';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '../../Logos';
import { socials } from 'content/about-me';

const AnimatedIcon = ({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <a
      href={href}
      className={styles.icon}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        transform: isClicked ? 'scale(0.8)' : isHovered ? 'scale(1.3) rotate(10deg)' : 'scale(1)',
        filter: isHovered ? `drop-shadow(0 0 12px ${color}) brightness(1.3)` : 'none',
        color: isHovered ? color : undefined,
        display: 'inline-flex',
        padding: '8px',
      }}
      aria-label={label}
    >
      {icon}
    </a>
  );
};

const Footer = () => (
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
          <AnimatedIcon href={socials.twitter.url} icon={<TwitterIcon />} label="Twitter" color="#1DA1F2" />
          <AnimatedIcon href={socials.linkedin.url} icon={<LinkedInIcon />} label="LinkedIn" color="#0A66C2" />
          <AnimatedIcon href={socials.github.url} icon={<GitHubIcon />} label="GitHub" color="#6cc644" />
          <AnimatedIcon href={socials.instagram.url} icon={<InstagramIcon />} label="Instagram" color="#E1306C" />
        </div>
      </div>
      <div className={styles.disclaimer}>&copy; {new Date().getFullYear()} Jack Morrison</div>
    </div>
  </footer>
);

export default Footer;
