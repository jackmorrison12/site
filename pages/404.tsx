import Link from 'next/link';
import { Layout } from '../components/Layout';

const _404Page = () => (
  <Layout title="404">
    <h1>404: Page Not Found</h1>
    <p>
      <Link href="/">
        <a>Home</a>
      </Link>
    </p>
  </Layout>
);

export default _404Page;
