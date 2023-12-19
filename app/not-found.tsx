// import Link from 'next/link';
// import { headers } from 'next/headers';
import { Title } from 'components/shared/Title';

export default function NotFound() {
  //   const heads = headers();
  //   const pathname = heads.get('x-invoke-path') || '';

  //   const v0 = await fetch(`https://v0.jackmorrison.xyz${pathname}`);
  //   const v1 = await fetch(`https://v1.jackmorrison.xyz${pathname}`);
  //   const v2 = await fetch(`https://v2.jackmorrison.xyz${pathname}`);
  //   const v4 = await fetch(`https://v4.jackmorrison.xyz${pathname}`);

  return (
    <>
      <Title value="404" offset="-865.96" bgOverride="NOTFOUND" />
      {/* <h1>{pathname} can&apos;t be found</h1>
      {v0.status === 200 && (
        <a href={`https://v0.jackmorrison.xyz${pathname}`}>This page is available on v0 of my website</a>
      )}
      {v1.status === 200 && (
        <a href={`https://v1.jackmorrison.xyz${pathname}`}>This page is available on v1 of my website</a>
      )}
      {v2.status === 200 && (
        <a href={`https://v2.jackmorrison.xyz${pathname}`}>This page is available on v2 of my website</a>
      )}
      {v4.status === 200 && (
        <a href={`https://v4.jackmorrison.xyz${pathname}`}>This page is available on v4 of my website</a>
      )}
      {v0.status !== 200 && v1.status !== 200 && v2.status !== 200 && v4.status !== 200 && (
        <p>
          Return <Link href="/">home</Link>
        </p>
      )} */}
    </>
  );
}
