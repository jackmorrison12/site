import { join } from 'path';
import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import matter from 'gray-matter';
import { Project } from './projects.types';

const PATH = 'content/projects';
const FILE_EXTN = '.md';

function getProjectFilePaths(): string[] {
  return fs.readdirSync(PATH);
}

function getProjectSlugs(): Array<{ params: { slug: string } }> {
  return getProjectFilePaths().map((fileName) => ({
    params: {
      slug: fileName.replace(FILE_EXTN, ''),
    },
  }));
}

export function getProjects(): Project[] {
  return getProjectSlugs()
    .map((slug) => ({ ...getProjectFrontmatter(slug.params.slug), slug: slug.params.slug }))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

function getProjectFrontmatter(slug: string): Project {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const file = fs.readFileSync(fullPath, 'utf-8');

  const { data } = matter(file);

  return data as unknown as Project;
}

export async function getProject(slug: string): Promise<{ mdxSource: MDXRemoteSerializeResult; frontmatter: Project }> {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const file = fs.readFileSync(fullPath, 'utf-8');

  const mdxSource = await serialize(file, { parseFrontmatter: true });

  const frontmatter = mdxSource.frontmatter as unknown as Project;
  frontmatter.slug = slug;

  return { mdxSource, frontmatter };
}
