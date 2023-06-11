import { getTag, getTagSlugs } from '../../../content-access/tags/tags';
import Link from 'next/link';

export const generateStaticParams = getTagSlugs;

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const tag = await getTag(slug);

  return (
    <>
      <h1>{tag.tag}</h1>
      {tag.items.map((i) => (
        <p key={i.title}>
          <Link href={i.slug}>{i.title}</Link>
        </p>
      ))}
    </>
  );
}
