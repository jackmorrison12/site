'use client';
import { Title } from 'components/shared/Title';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'react-query';

import styles from './not-found.module.scss';

import { archives } from 'content/archives';

export default function NotFound() {
  const pathname = usePathname().slice(0);
  const { isLoading, isError, data } = useQuery(
    ['notFound', { pathname }],
    async () =>
      (await (await fetch(`/api/checkArchives?path=${pathname}`)).json()) as {
        v0: number;
        v1: number;
        v2: number;
        v3: number;
        v4: number;
      },
  );

  if (isLoading) {
    return (
      <>
        <Title value="404" offset="-865.96" bgOverride="NOTFOUND" />
        <h1>
          Checking previous versions of my site for <Link href={pathname}>{pathname}</Link>...
        </h1>
      </>
    );
  }

  if (
    isError ||
    !data ||
    (data && data.v0 !== 200 && data.v1 !== 200 && data.v2 !== 200 && data.v3 !== 200 && data.v4 !== 200)
  ) {
    return (
      <>
        <Title value="404" offset="-865.96" bgOverride="NOTFOUND" />
        <h1>
          <Link href={pathname}>{pathname}</Link> can&apos;t be found here, or on any previous iteration of my site
        </h1>
        <b className={styles.readMore}>
          <Link href="/archive">Learn more</Link> about previous iterations of this site, or{' '}
          <Link href="/">return home</Link>
        </b>
      </>
    );
  }

  const results = archives
    .map((a) => ({ ...a, status: data[`v${a.version}`] }))
    .filter((r) => r.status === 200)
    .sort((a, b) => (a.version > b.version ? -1 : 1));

  return (
    <>
      <Title value="404" offset="-865.96" bgOverride="NOTFOUND" />
      <h1>
        <Link href={pathname}>{pathname}</Link> isn&apos;t available here, but it did exist on a previous version of my
        site...
      </h1>
      <div className={styles.sitesWrapper}>
        {results.map((a) => (
          <div key={a.version} className={styles.site}>
            <h2>
              <a
                href={`https://v${a.version}.jackmorrison.xyz${pathname}`}
              >{`v${a.version}.jackmorrison.xyz${pathname}`}</a>
            </h2>
            <h3>{a.date}</h3>
            <a href={`https://v${a.version}.jackmorrison.xyz${pathname}`} className={styles.imageWrapper}>
              <Image src={a.imageSrc} alt={`Version ${a.version} of my personal site`} objectFit="cover" fill={true} />
            </a>
            <p>{a.summary}</p>
          </div>
        ))}
      </div>
      <b>
        <Link href="/archive">Learn more</Link> about previous iterations of this site, or{' '}
        <Link href="/">return home</Link>{' '}
      </b>
    </>
  );
}
