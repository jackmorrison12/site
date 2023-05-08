import React from 'react';

import styles from './Layout.module.scss';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import { LayoutProps } from './Layout.types';

// should there be a separate textarea layout, or a prop? just for smaller margins

export const Layout = ({ children, title = 'Jack Morrison' }: LayoutProps) => (
  <div className={styles.app}>
    <Header title={title} />
    <main className={styles.content}>{children}</main>
    <Footer />
  </div>
);
