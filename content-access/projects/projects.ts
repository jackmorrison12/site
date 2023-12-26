import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Project } from './projects.types';
import { compileMDX } from 'next-mdx-remote/rsc';

const PATH = join(process.cwd(), 'content/projects');
const FILE_EXTN = '.mdx';

function getProjectFilePaths(): string[] {
  return fs.readdirSync(PATH);
}

export function getProjectSlugs(): Array<{ slug: string }> {
  return getProjectFilePaths().map((fileName) => ({
    slug: fileName.replace(FILE_EXTN, ''),
  }));
}

export function getProjects(): Project[] {
  return getProjectSlugs()
    .map((slug) => ({ ...getProjectFrontmatter(slug.slug), slug: `/projects/${slug.slug}` }))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function getProjectFrontmatter(slug: string): Project {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const file = fs.readFileSync(fullPath, 'utf-8');

  const { data } = matter(file);

  data.slug = `/projects/${slug}`;

  return data as unknown as Project;
}

export async function getProject(slug: string): Promise<{ rawMDX: string; frontmatter: Project }> {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const rawMDX = fs.readFileSync(fullPath, 'utf-8');

  const { frontmatter } = await compileMDX<Project>({
    source: rawMDX,
    options: { parseFrontmatter: true },
  });

  frontmatter.slug = `/projects/${slug}`;

  return { rawMDX, frontmatter };
}
