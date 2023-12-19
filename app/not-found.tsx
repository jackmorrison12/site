'use client';
import { Title } from 'components/shared/Title';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'react-query';

export default function NotFound() {
  const pathname = usePathname().slice(0);
  const { isLoading, data } = useQuery(
    ['notFound', { pathname }],
    async () => await (await fetch(`/api/checkArchives?path=${pathname}`)).json(),
  );

  return (
    <>
      <Title value="404" offset="-865.96" bgOverride="NOTFOUND" />
      {isLoading ? (
        <p>loading...</p>
      ) : (
        <>
          <h1>{pathname} can&apos;t be found</h1>
          {data.v0 === 200 && (
            <a href={`https://v0.jackmorrison.xyz${pathname}`}>This page is available on v0 of my website</a>
          )}
          {data.v1 === 200 && (
            <a href={`https://v1.jackmorrison.xyz${pathname}`}>This page is available on v1 of my website</a>
          )}
          {data.v2 === 200 && (
            <a href={`https://v2.jackmorrison.xyz${pathname}`}>This page is available on v2 of my website</a>
          )}
          {data.v4 === 200 && (
            <a href={`https://v4.jackmorrison.xyz${pathname}`}>This page is available on v4 of my website</a>
          )}
          {data.v0 !== 200 && data.v1 !== 200 && data.v2 !== 200 && data.v4 !== 200 && (
            <p>
              Return <Link href="/">home</Link>
            </p>
          )}
        </>
      )}
    </>
  );
}
