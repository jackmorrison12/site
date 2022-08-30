import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout/Layout';

import { getProjects } from '../../content-access/projects/projects';
import { Project } from '../../content-access/projects/projects.types';

type Props = {
  projects: Project[];
};

const ProjectsPage = ({ projects }: Props) => (
  <Layout title="Projects">
    <h1>Projects</h1>
    <ul>
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={p.slug ?? '#'}>
            <a>{p.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
);

export default ProjectsPage;

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getProjects();

  return {
    props: {
      projects,
    },
  };
};
