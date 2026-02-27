'use client';
import Link from 'next/link';
import React from 'react';
import styles from './Footer.module.css';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from '../../Logos';
import { socials } from 'content/about-me';

const IconLink = ({ href, icon, label, colorClass }: { href: string; icon: React.ReactNode; label: string; colorClass: string }) => (
  <a
    href={href}
    className={`${styles.icon} ${styles[colorClass]}`}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

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
          <IconLink href={socials.twitter.url} icon={<TwitterIcon />} label="Twitter" colorClass="twitter" />
          <IconLink href={socials.linkedin.url} icon={<LinkedInIcon />} label="LinkedIn" colorClass="linkedin" />
          <IconLink href={socials.github.url} icon={<GitHubIcon />} label="GitHub" colorClass="github" />
          <IconLink href={socials.instagram.url} icon={<InstagramIcon />} label="Instagram" colorClass="instagram" />
        </div>
      </div>
      <div className={styles.disclaimer}>&copy; {new Date().getFullYear()} Jack Morrison</div>
    </div>
  </footer>
);

export default Footer;
