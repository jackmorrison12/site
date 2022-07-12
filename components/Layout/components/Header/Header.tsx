import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { HeaderProps } from './Header.types';

import styles from './Header.module.css';
import { headerLinks } from './Header.data';

import { useRouter } from 'next/router';

import { Squash as Hamburger } from 'hamburger-react';
import { useTheme } from 'next-themes';
import { useHeader } from './Header.hooks';

const Header = ({ title }: HeaderProps) => {
  const { router, navViewable, setNavViewable, mounted, theme, setTheme, themes } = useHeader();

  return (
    <>
      <Head>
        <title>{title == 'Jack Morrison' ? title : title + ' | Jack Morrison'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className={styles.header}>
        <div className={styles.title}>
          <h3>{title ?? 'Jack Morrison'}</h3>
          {mounted && (
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {themes.map((t) => (
                <option value={t}>{t}</option>
              ))}
            </select>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <Hamburger
              toggled={navViewable}
              toggle={setNavViewable}
              size={20}
              duration={0.2}
              color={'var(--greyText)'}
              rounded
            />
          </div>
        </div>
        {navViewable && (
          <nav className={styles.nav}>
            {headerLinks.map((link) => (
              <Link href={link.url} key={link.url}>
                <a className={`${styles.link} ${router.pathname === link.url ? styles.activeLink : ''}`}>
                  {link.emoji} {link.name}
                </a>
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
