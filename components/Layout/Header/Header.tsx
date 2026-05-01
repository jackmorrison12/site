'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Squash as Hamburger } from 'hamburger-react';
import { AnimatePresence, motion } from 'motion/react';

import styles from './Header.module.css';
import { headerLinks } from './Header.data';
import { useHeader } from './Header.hooks';
import { HeaderProps, HeaderLink } from './Header.types';
import { ThemePicker } from './ThemePicker';

const isLinkActive = (link: HeaderLink, pathname: string | null) =>
  link.url === '/' ? pathname === link.url : !!pathname?.includes(link.url);

const NavLinks = ({
  pathname,
  layoutId,
  onNavigate,
}: {
  pathname: string | null;
  layoutId: string;
  onNavigate?: () => void;
}) => (
  <>
    {headerLinks.map((link) => {
      const active = isLinkActive(link, pathname);
      return (
        <Link
          href={link.url}
          key={link.url}
          className={styles.link}
          data-active={active}
          onClick={onNavigate}
        >
          {active && (
            <motion.span
              layoutId={layoutId}
              className={styles.pill}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className={styles.linkInner}>
            {link.emoji} {link.name}
          </span>
        </Link>
      );
    })}
  </>
);

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
        <div className={styles.bar}>
          <h3 className={styles.brand}>
            <Link href="/">Jack Morrison</Link>
          </h3>
          <nav className={styles.desktopNav} aria-label="Primary">
            <NavLinks pathname={_.pathname} layoutId="navPillDesktop" />
          </nav>
          <div className={styles.tools}>
            <ThemePicker />
            <div className={styles.hamburgerWrapper}>
              <Hamburger
                toggled={_.navViewable}
                toggle={_.setNavViewable}
                size={20}
                duration={0.2}
                color={'var(--greyText)'}
                rounded
                label="Toggle navigation"
              />
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {_.navViewable && (
            <motion.nav
              key="mobile-nav"
              className={styles.mobileNav}
              aria-label="Primary mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className={styles.mobileNavInner}>
                <NavLinks
                  pathname={_.pathname}
                  layoutId="navPillMobile"
                  onNavigate={() => _.setNavViewable(false)}
                />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
