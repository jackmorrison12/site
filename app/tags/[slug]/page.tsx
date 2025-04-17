import { notFound } from 'next/navigation';
import { getTag, getTagSlugs } from '../../../content-access/tags/tags';
import Link from 'next/link';

export const generateStaticParams = getTagSlugs;

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  let tag = undefined;
  try {
    tag = await getTag(slug);
  } catch {
    return notFound();
  }

  if (!tag.tag) {
    return notFound();
  }

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const tag = await getTag(params.slug);
    return {
      title: tag.tag,
      description: `Items tagged with ${tag.tag}`,
    };
  } catch {
    return {
      title: 'Unknown tag',
      description: 'Unknown tag',
    };
  }
}
