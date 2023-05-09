import Link from 'next/link';
import { Layout } from '../components/Layout';

const CVPage = () => (
  <Layout title="Me">
    <h1>CV</h1>
    <p>This page will host my CV in react</p>
    <p>
      <Link href="/">Go home</Link>
    </p>
  </Layout>
);

export default CVPage;
