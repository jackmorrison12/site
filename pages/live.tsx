import Link from 'next/link';
import Layout from '../components/Layout/Layout';

const LivePage = () => (
  <Layout title="Live">
    <h1>Live</h1>
    <p>This is the live page</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default LivePage;
