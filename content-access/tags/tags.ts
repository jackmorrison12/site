import fs from 'fs';
import slugify from 'slugify';
import matter from 'gray-matter';
import { getProjectFrontmatter } from '../projects/projects';
import { Project } from '../projects/projects.types';

const PATHS = ['content/projects'];

function getAllFilePathsWithTags(): string[] {
  return PATHS.map((p) => fs.readdirSync(p).map((f) => `${p}/${f}`)).flat();
}

export function getTagSlugs(): Array<{ slug: string }> {
  const tagSlugs = new Set<string>();

  getAllFilePathsWithTags().forEach((fileName) => {
    const tags = matter(fs.readFileSync(fileName, 'utf-8')).data.tags as string[] | undefined;
    tags?.forEach((t) => tagSlugs.add(slugify(t, { lower: true })));
  });

  return Array.from(tagSlugs).map((t) => ({ slug: t }));
}

export function getTagSlugToTitleMap(): { [key: string]: string } {
  const tagMap: { [key: string]: string } = {};

  getAllFilePathsWithTags().forEach((fileName) => {
    const tags = matter(fs.readFileSync(fileName, 'utf-8')).data.tags as string[] | undefined;
    tags?.forEach((t) => (tagMap[slugify(t, { lower: true })] = t));
  });

  return tagMap;
}

function convertFileNameToItem(fileName: string): Project | null {
  const projectRegex = /content\/projects\/(?<firstName>.+)\.mdx/u;
  if (projectRegex.test(fileName)) {
    return getProjectFrontmatter(projectRegex.exec(fileName)!.groups!.firstName);
  }
  return null;
}

export function getTag(slugifiedTag: string): { items: Array<Project>; tag: string } {
  const items = getAllFilePathsWithTags()
    .map((fileName) => {
      const tags = matter(fs.readFileSync(fileName, 'utf-8')).data.tags as string[] | undefined;
      return tags?.some((t) => slugify(t, { lower: true }) === slugifiedTag) ? convertFileNameToItem(fileName) : null;
    })
    .filter((i) => i !== null) as Array<Project>;

  return { items, tag: getTagSlugToTitleMap()[slugifiedTag.toLowerCase()] };
}
