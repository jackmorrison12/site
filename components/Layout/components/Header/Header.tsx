import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { HeaderProps } from './Header.types';

import styles from './Header.module.css';
import { headerLinks } from './Header.data';

import { useRouter } from 'next/router';

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  const [navViewable, setNavViewable] = useState(false);

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
          <div>Theme</div>
          <button onClick={() => setNavViewable(!navViewable)}>Hamburger</button>
        </div>
        {navViewable && (
          <nav className={styles.nav}>
            {headerLinks.map((link) => (
              <Link href={link.url}>
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
