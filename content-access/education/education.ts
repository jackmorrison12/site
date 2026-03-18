import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Education } from './education.types';
import { compileMDX } from 'next-mdx-remote/rsc';

const PATH = join(process.cwd(), 'content/education');
const FILE_EXTN = '.mdx';

function getEducationFilePaths(): string[] {
  return fs.readdirSync(PATH);
}

export function getEducationSlugs(): Array<{ slug: string }> {
  return getEducationFilePaths().map((fileName) => ({
    slug: fileName.replace(FILE_EXTN, ''),
  }));
}

export function getEducations(): Education[] {
  return getEducationSlugs()
    .map((slug) => ({
      ...getEducationFrontmatter(slug.slug),
      slug: slug.slug,
    }))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function getEducationFrontmatter(slug: string): Education {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const file = fs.readFileSync(fullPath, 'utf-8');
  const { data } = matter(file);
  data.slug = slug;
  return data as unknown as Education;
}

export async function getEducation(slug: string): Promise<{ rawMDX: string; frontmatter: Education }> {
  const fullPath = join(PATH, `${slug}${FILE_EXTN}`);
  const rawMDX = fs.readFileSync(fullPath, 'utf-8');
  const { frontmatter } = await compileMDX<Education>({
    source: rawMDX,
    options: {
      parseFrontmatter: true,
      blockJS: false,
    },
  });
  frontmatter.slug = slug;
  return { rawMDX, frontmatter };
}
