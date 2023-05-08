import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';

import { Layout } from '../../components/Layout';
import { Project } from '../../content-access/projects/projects.types';
import { getTag, getTagSlugs } from '../../content-access/tags/tags';

type Props = {
  errors?: string;
  items?: Array<Project>;
  tag: string;
};

const TagPage = ({ errors, items, tag }: Props) => {
  if (!items || !tag || errors) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout title={tag}>
      <h1>{tag}</h1>
      {items.map((i) => (
        <p key={i.title}>
          <Link href={i.slug}>{i.title}</Link>
        </p>
      ))}
    </Layout>
  );
};

export default TagPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getTagSlugs();
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return { props: { errors: 'No slug given' } };
  }

  const slug = params.slug;

  if (!(typeof slug === 'string')) {
    return { props: { errors: 'Incorrect slug type' } };
  }

  return {
    props: {
      ...getTag(slug),
    },
  };
};
