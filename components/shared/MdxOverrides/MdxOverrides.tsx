import styles from './MdxOverrides.module.scss';
import Image from 'next/image';

export const H2Override = ({ children }: { children?: any }) => (
  <h2>
    <mark className={styles.h2}>{children}</mark>
  </h2>
);

export const ImgWithCaption = ({
  children,
  imgProps,
}: {
  children?: any;
  imgProps: { src: string; alt?: string; height: string; width: string };
}) => (
  <div className={styles.imgCaptionWrapper}>
    <div className={styles.caption}>{children}</div>
    <div className={styles.imageSection}>
      <div className={styles.imageWrapper}>
        <Image {...imgProps} objectFit="scale-down" />
      </div>
    </div>
  </div>
);
export const mdxOverrides = { h2: H2Override, ImgWithCaption };
