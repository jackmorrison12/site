import React from 'react';
import { Project } from '../../../content-access/projects/projects.types';
import { useProjectHeader } from './ProjectHeader.hooks';
import { ImageProps } from '../../../content-access';

import styles from './ProjectHeader.module.scss';
import Image from 'next/legacy/image';
import Link from 'next/link';
import slugify from 'slugify';

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
            <Link href={`/tags/${slugify(t, { lower: true })}`} key={t} className={styles.link} passHref>
              <div className={styles.tag}>{t}</div>
            </Link>
          ))}
          {project.sources?.map((t) => (
            <Link href={t.url} key={t.name} className={styles.link} passHref>
              <div className={styles.tag}>{t.name}</div>
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
