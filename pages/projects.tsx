import Link from 'next/link';
import Layout from '../components/Layout/Layout';

const ProjectsPage = () => (
  <Layout title="Projects">
    <h1>Projects</h1>
    <p>This page will host my Projects</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default ProjectsPage;
