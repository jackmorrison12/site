import styles from './projects.module.scss';

import { ProjectSummary } from 'components/Projects/ProjectSummary/ProjectSummary';

import { getProjects } from '../../content-access/projects/projects';
import { Title } from '../../components/shared/Title';

export default async function Page() {
  const projects = await getProjects().filter((p) => !p.isHidden);

  return (
    <>
      <Title value="PROJECTS" offset="-789.75" />
      <div className={styles.projectsWrapper}>
        {projects.map((p) => (
          <ProjectSummary project={p} key={p.slug} />
        ))}
      </div>
    </>
  );
}

export const metadata = {
  title: 'Projects',
  description: "Some projects I've worked on",
};
