import React from 'react';
import { Project } from '../../../content-access/projects/projects.types';
import { useProjectHeader } from './ProjectHeader.hooks';

import styles from './ProjectHeader.module.scss';
import Image from 'next/image';
import { relative } from 'path';
import Link from 'next/link';

const ProjectHeader = ({ project }: { project: Project }) => {
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
            <Link href={t.url}>
              <a className={styles.link}>
                <div key={t.name} className={styles.tag}>
                  {t.name}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.icon}>
        <div className={styles.iconWrapper}>
          <Image src={project.heroImg} width="500px" height="500px" />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;