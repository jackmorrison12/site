import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Job } from './jobs.types';
import { compileMDX } from 'next-mdx-remote/rsc';

const PATH = join(process.cwd(), 'content/jobs');
const FILE_EXTN = '.mdx';

function getJobFilePaths(): string[] {
  return fs.readdirSync(PATH);
}

export function getJobSlugs(): Array<{ slug: string }> {
  return getJobFilePaths().map((fileName) => ({
    slug: fileName.replace(FILE_EXTN, ''),
  }));
}

export function getJobs(): Job[] {
  return getJobSlugs()
    .map((slug) => ({
      ...getJobFrontmatter(slug.slug),
      slug: slug.slug,
    }))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function getJobFrontmatter(slug: string): Job {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const file = fs.readFileSync(fullPath, 'utf-8');
  const { data } = matter(file);
  data.slug = slug;
  return data as unknown as Job;
}

export async function getJob(slug: string): Promise<{ rawMDX: string; frontmatter: Job }> {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const rawMDX = fs.readFileSync(fullPath, 'utf-8');
  const { frontmatter } = await compileMDX<Job>({
    source: rawMDX,
    options: {
      parseFrontmatter: true,
      blockJS: false,
    },
  });
  frontmatter.slug = slug;
  return { rawMDX, frontmatter };
}
