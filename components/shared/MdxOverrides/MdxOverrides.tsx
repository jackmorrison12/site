import { ReactNode } from 'react';
import styles from './MdxOverrides.module.scss';
import Image from 'next/legacy/image';

export const H2Override = ({ children }: { children?: ReactNode }) => (
  <h2>
    <mark className={styles.mark}>{children}</mark>
  </h2>
);

export const POverride = ({ children }: { children?: ReactNode }) => <p className={styles.p}>{children}</p>;

export const Accent = ({ children }: { children?: ReactNode }) => <span className={styles.accent}>{children}</span>;

export const Footnote = ({ children }: { children?: ReactNode }) => <span className={styles.footnote}>{children}</span>;

export const ImgWithCaption = ({
  children,
  imgProps,
}: {
  children?: ReactNode;
  imgProps: { src: string; alt?: string; height: number; width: number };
}) => (
  <div className={styles.imgCaptionWrapper}>
    <div className={styles.caption}>{children}</div>
    <div className={styles.imageSection}>
      <div className={styles.imageWrapper}>
        <Image {...imgProps} title={imgProps.alt} objectFit="scale-down" />
      </div>
    </div>
  </div>
);

export const DoubleImg = ({
  img1Props,
  img2Props,
}: {
  img1Props: { src: string; alt?: string; height: number; width: number };
  img2Props: { src: string; alt?: string; height: number; width: number };
}) => (
  <div className={styles.imgCaptionWrapper}>
    <div className={styles.doubleImgSection}>
      <div className={styles.imageWrapper}>
        <Image {...img1Props} title={img1Props.alt} />
      </div>
    </div>{' '}
    <div className={styles.imageSection}>
      <div className={styles.imageWrapper}>
        <Image {...img2Props} title={img2Props.alt} />
      </div>
    </div>
  </div>
);

export const AOverride = ({ children, ...rest }: { children?: ReactNode }) => (
  <a {...rest} className={styles.a}>
    {children}
  </a>
);

export const mdxOverrides = { h2: H2Override, ImgWithCaption, DoubleImg, Accent, Footnote, p: POverride, a: AOverride };
