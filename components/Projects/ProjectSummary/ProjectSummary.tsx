import React from 'react';
import { Project } from '../../../content-access/projects/projects.types';
import { ImageProps } from '../../../content-access';

import styles from './ProjectSummary.module.scss';
import Image from 'next/legacy/image';
import Link from 'next/link';
import slugify from 'slugify';

const ProjectHeader = ({
  project,
}: // imageProps,
{
  project: Project;
  // imageProps: {
  //   [key: string]: ImageProps;
  // };
}) => {
  return (
    <div className={styles.layout} key={project.slug}>
      <Link href={project.slug ?? '#'} passHref>
        <div className={styles.innerLayout}>
          <div className={styles.imageWrapper}>
            <Image alt={`${project.title} Banner Image`} src={project.bannerImg} width="3000" height="1500" />
          </div>
          <div className={styles.infoWrapper}>
            <h1 className={styles.header}>{project.title}</h1>
            <p>
              <i>{project.description}</i>
            </p>
            <div className={styles.tagContainer}>
              {project.tags.map((t) => (
                <div key={t} className={styles.tag}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectHeader;
