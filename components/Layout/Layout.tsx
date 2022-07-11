import React from 'react';

import styles from './Layout.module.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { LayoutProps } from './Layout.types';

const Layout = ({ children, title = 'Jack Morrison' }: LayoutProps) => (
  <div className={styles.app}>
    <Header title={title} />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
