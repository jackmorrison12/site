import Link from 'next/link';
import styles from './BackLink.module.scss';

const BackLink = ({ text }: { text: string }) => (
  <p className={styles.wrapper}>
    {'<'}
    <Link href="/projects">
      <a>{text}</a>
    </Link>
  </p>
);

export default BackLink;
