import Link from 'next/link';
import Layout from '../components/Layout/Layout';

const IndexPage = () => (
  <Layout title="Home">
    <h1>Home</h1>
    <p>
      <Link href="/me">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
