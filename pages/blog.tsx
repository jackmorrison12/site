import Link from 'next/link';
import Layout from '../components/Layout/Layout';

const BlogPage = () => (
  <Layout title="Blog">
    <h1>Blog</h1>
    <p>This is where I can put any interesting musings</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default BlogPage;
