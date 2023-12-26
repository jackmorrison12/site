import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPlaiceholder } from 'plaiceholder';
import TextWrapper from '../../../components/Layout/TextWrapper/TextWrapper';
import ProjectHeader from '../../../components/Projects/ProjectHeader/ProjectHeader';
import BackLink from '../../../components/shared/BackLink/BackLink';
import { mdxOverrides } from '../../../components/shared/MdxOverrides/MdxOverrides';
import { getProject, getProjectSlugs } from '../../../content-access/projects/projects';
import Image from 'next/legacy/image';
import { notFound } from 'next/navigation';

export const generateStaticParams = getProjectSlugs;

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  let project = undefined;
  try {
    project = await getProject(slug);
  } catch {
    return notFound();
  }
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
  } as const;

  return (
    <>
      <BackLink text="All Projects" />
      <ProjectHeader project={project.frontmatter} imageProps={imageProps} />
      <TextWrapper>
        <MDXRemote
          source={project.rawMDX}
          components={{ Image, ...mdxOverrides }}
          options={{ parseFrontmatter: true }}
        />
      </TextWrapper>
    </>
  );
}
