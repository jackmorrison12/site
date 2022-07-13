import React from 'react';

import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.intro}>Hey 👋 </div>
    <div className={styles.socials}>Socials</div>
    <div className={styles.popular}>Popular</div>
    <div className={styles.recent}>Recent</div>
    <div className={styles.useful}>Useful</div>
    <div className={styles.disclaimer}>© {new Date().getFullYear()} Jack Morrison</div>
  </footer>
);

export default Footer;
