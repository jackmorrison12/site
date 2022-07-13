import Link from 'next/link';
import Layout from '../components/Layout/Layout';

const MePage = () => (
  <Layout title="Me">
    <h1>About Me</h1>
    <p>This is the about page</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default MePage;
