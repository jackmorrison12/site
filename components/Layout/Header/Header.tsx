'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Squash as Hamburger } from 'hamburger-react';

import styles from './Header.module.css';
import { headerLinks } from './Header.data';
import { useHeader } from './Header.hooks';
import { HeaderProps } from './Header.types';
import { ThemePicker } from './ThemePicker';

const Header = ({ title }: HeaderProps) => {
  const _ = useHeader();

  return (
    <>
      <Head>
        <title>{title == 'Jack Morrison' ? title : title + ' | Jack Morrison'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className={styles.header}>
        <div className={styles.title}>
          <h3>
            <Link href="/">Jack Morrison</Link>
          </h3>
          <ThemePicker />
          <div style={{ marginLeft: 'auto' }}>
            <Hamburger
              toggled={_.navViewable}
              toggle={_.setNavViewable}
              size={20}
              duration={0.2}
              color={'var(--greyText)'}
              rounded
            />
          </div>
        </div>
        {_.navViewable && (
          <nav className={styles.nav}>
            {headerLinks.map((link) => (
              <Link
                href={link.url}
                key={link.url}
                className={`${styles.link} ${
                  (link.url === '/' ? _.pathname === link.url : _.pathname?.includes(link.url)) ? styles.activeLink : ''
                }`}
              >
                {link.emoji} {link.name}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
