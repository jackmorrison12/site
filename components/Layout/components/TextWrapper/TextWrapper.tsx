import React, { ReactNode } from 'react';

import styles from './TextWrapper.module.css';

const Layout = ({ children }: { children: ReactNode }) => <div className={styles.wrapper}>{children}</div>;

export default Layout;
