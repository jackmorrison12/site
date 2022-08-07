import { GetStaticProps, GetStaticPaths } from 'next';

import fs from 'fs';

import Layout from '../../components/Layout/Layout';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getProject } from '../../content-access/projects/projects';
import { Project } from '../../content-access/projects/projects.types';

type Props = {
  mdxSource?: MDXRemoteSerializeResult;
  frontmatter?: Project;
  errors?: string;
};

export default ({ mdxSource, frontmatter, errors }: Props) => {
  if (!mdxSource || !frontmatter || errors) {
    return (
      <Layout title="Error">
        <p>
          <span style={{ color: 'red' }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout title={frontmatter.title}>
      {new Date(Date.parse(frontmatter.startDate)).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'long',
      })}
      <MDXRemote {...mdxSource} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync('content/projects');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.md', ''),
    },
  }));

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

  const project = await getProject(slug);

  return {
    props: {
      ...project,
    },
  };
};
