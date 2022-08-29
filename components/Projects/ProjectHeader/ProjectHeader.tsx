import React from 'react';
import { Project } from '../../../content-access/projects/projects.types';
import { useProjectHeader } from './ProjectHeader.hooks';
import { ImageProps } from '../../../content-access';

import styles from './ProjectHeader.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const ProjectHeader = ({
  project,
  imageProps,
}: {
  project: Project;
  imageProps: {
    [key: string]: ImageProps;
  };
}) => {
  const $ = useProjectHeader({ project });

  return (
    <div className={styles.layout}>
      <div className={styles.info}>
        <h1>{project.title}</h1>
        <h3>
          <i>{project.description}</i>
        </h3>
        <h3>
          {$.startDate} - {$.endDate}
        </h3>
        <div className={styles.tagContainer}>
          {project.tags.map((t) => (
            <div key={t} className={styles.tag}>
              {t}
            </div>
          ))}
          {project.sources?.map((t) => (
            <Link href={t.url} key={t.name}>
              <a className={styles.link}>
                <div className={styles.tag}>{t.name}</div>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.icon}>
        <div className={`${styles.iconWrapper} ${styles.mobileHide}`}>
          <Image {...imageProps['hero']} />
        </div>
        <div className={`${styles.iconWrapper} ${styles.mobileShow}`}>
          <Image {...imageProps['banner']} />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
