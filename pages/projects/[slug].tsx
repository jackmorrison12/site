import { GetStaticProps, GetStaticPaths } from 'next';
import fs from 'fs';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';
import { getPlaiceholder } from 'plaiceholder';

import Layout from '../../components/Layout/Layout';
import { getProject } from '../../content-access/projects/projects';
import { Project } from '../../content-access/projects/projects.types';
import { ImageProps } from '../../content-access';
import ProjectHeader from '../../components/Projects/ProjectHeader/ProjectHeader';
import TextWrapper from '../../components/Layout/components/TextWrapper/TextWrapper';
import BackLink from '../../components/shared/BackLink/BackLink';
import { mdxOverrides } from '../../components/shared/MdxOverrides/MdxOverrides';

type Props = {
  mdxSource?: MDXRemoteSerializeResult;
  frontmatter?: Project;
  errors?: string;
  imageProps?: {
    [key: string]: ImageProps;
  };
};

const ProjectPage = ({ mdxSource, frontmatter, errors, imageProps }: Props) => {
  if (!mdxSource || !frontmatter || !imageProps || errors) {
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
      <BackLink text="All Projects" />
      <ProjectHeader project={frontmatter} imageProps={imageProps} />
      <TextWrapper>
        <MDXRemote {...mdxSource} components={{ Image, ...mdxOverrides }} />
      </TextWrapper>
    </Layout>
  );
};

export default ProjectPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync('content/projects');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.mdx', ''),
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

  const { base64: heroOptimised, img: heroImg } = await getPlaiceholder(project.frontmatter.heroImg, { size: 10 });
  const { base64: bannerOptimised, img: bannerImg } = await getPlaiceholder(project.frontmatter.bannerImg, {
    size: 10,
  });

  const imageProps = {
    hero: {
      ...heroImg,
      blurDataURL: heroOptimised,
      placeholder: 'blur',
    },
    banner: {
      ...bannerImg,
      blurDataURL: bannerOptimised,
      placeholder: 'blur',
    },
  };

  return {
    props: {
      ...project,
      imageProps,
    },
  };
};
