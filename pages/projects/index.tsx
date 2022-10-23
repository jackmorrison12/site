import { GetStaticProps } from 'next';

import styles from './index.module.scss';

import Layout from '../../components/Layout/Layout';
import ProjectSummary from '../../components/Projects/ProjectSummary/ProjectSummary';

import { getProjects } from '../../content-access/projects/projects';
import { Project } from '../../content-access/projects/projects.types';

type Props = {
  projects: Project[];
};

const ProjectsPage = ({ projects }: Props) => (
  <Layout title="Projects">
    <div className={styles.titleWrapper}>
      <span className={styles.title}>PROJECTS</span>
    </div>
    <div className={styles.projectsWrapper}>
      {projects.map((p) => (
        <ProjectSummary project={p} key={p.slug} />
      ))}
    </div>
  </Layout>
);

export default ProjectsPage;

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getProjects().filter((p) => !p.isHidden);

  return {
    props: {
      projects,
    },
  };
};
