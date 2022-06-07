import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  title: string;
};

const Header = ({ title }: Props) => (
  <>
    <Head>
      <title>{title == 'Jack Morrison' ? title : title + ' | Jack Morrison'}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>{' '}
        |{' '}
        <Link href="/api/users">
          <a>Users API</a>
        </Link>{' '}
      </nav>
    </header>
  </>
);

export default Header;
