import styles from './MdxOverrides.module.scss';
import Image from 'next/image';

export const H2Override = ({ children }: { children?: any }) => (
  <h2>
    <mark className={styles.h2}>{children}</mark>
  </h2>
);

export const ImgWithCaption = ({ children, imgSrc, imgAlt }: { children?: any; imgSrc: string; imgAlt: string }) => (
  <div className={styles.imgCaptionWrapper}>
    <div style={{ gridArea: 'caption', marginTop: 'auto', marginBottom: 'auto' }}>{children}</div>
    <div style={{ gridArea: 'image', position: 'relative' }}>
      <div style={{ overflow: 'hidden', borderRadius: '10px', display: 'flex' }}>
        <Image src={imgSrc} height="540" width="960" alt={imgAlt} objectFit="scale-down" />
      </div>
    </div>
  </div>
);

export const mdxOverrides = { h2: H2Override, ImgWithCaption };
