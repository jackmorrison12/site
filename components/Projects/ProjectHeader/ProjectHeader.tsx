import React from 'react';
import { Project } from '../../../content-access/projects/projects.types';

import styles from './ProjectHeader.module.scss';

const ProjectHeader = ({ project }: { project: Project }) => (
  <div className={styles.layout}>
    <div className={styles.info}>
      <h1>{project.title}</h1>
      <h2>
        <i>{project.description}</i>
      </h2>
      <h3>
        {new Date(Date.parse(project.startDate)).toLocaleString('en-GB', {
          year: 'numeric',
          month: 'long',
        })}{' '}
        -{' '}
        {new Date(Date.parse(project.endDate)).toLocaleString('en-GB', {
          year: 'numeric',
          month: 'long',
        })}
      </h3>
      <div className={styles.tagContainer}>
        {project.tags.map((t) => (
          <div className={styles.tag}>{t}</div>
        ))}
      </div>
      <div className={styles.line} />
    </div>
    <div className={styles.icon}>{project.heroImg}</div>
  </div>
);

export default ProjectHeader;
