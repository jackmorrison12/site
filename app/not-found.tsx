'use client';
import { Title } from 'components/shared/Title';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'react-query';

import styles from './not-found.module.scss';

import v0 from 'public/img/archive/v0.png';
import v1 from 'public/img/archive/v1.png';
import v2 from 'public/img/archive/v2.png';
import v3 from 'public/img/archive/v3.png';
import v4 from 'public/img/archive/v4.png';

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
        <p>Looking at previous versions of my site...</p>
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
        <h1>{pathname} can&apos;t be found</h1>
        <p>
          Return <Link href="/">home</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Title value="404" offset="-865.96" bgOverride="NOTFOUND" />
      <>
        <h1>{pathname} isn&apos;t available here, but it did exist on a previous version of my site...</h1>
        <div className={styles.imagesWrapper}>
          {data.v0 === 200 && (
            <a href={`https://v0.jackmorrison.xyz${pathname}`} style={{ flexBasis: '30%' }}>
              <Image
                src={v0}
                // fill={true}
                placeholder="blur"
                // objectFit="cover"
                alt={'A picture of me at teamLab Tokyo'}
                height={200}
              />
            </a>
          )}
          {data.v1 === 200 && (
            <a href={`https://v1.jackmorrison.xyz${pathname}`} style={{ flexBasis: '30%' }}>
              <Image
                src={v1}
                // fill={true}
                placeholder="blur"
                // objectFit="cover"
                alt={'A picture of me at teamLab Tokyo'}
                height={200}
              />
            </a>
          )}
          {data.v2 === 200 && (
            <a href={`https://v2.jackmorrison.xyz${pathname}`} style={{ flexBasis: '30%' }}>
              <Image
                src={v2}
                // fill={true}
                placeholder="blur"
                // objectFit="cover"
                alt={'A picture of me at teamLab Tokyo'}
                height={200}
              />
            </a>
          )}
          {data.v3 === 200 && (
            <a href={`https://v3.jackmorrison.xyz${pathname}`} style={{ flexBasis: '30%' }}>
              <Image
                src={v3}
                // fill={true}
                placeholder="blur"
                // objectFit="cover"
                alt={'A picture of me at teamLab Tokyo'}
                height={200}
              />
            </a>
          )}
          {data.v4 === 200 && (
            <a href={`https://v4.jackmorrison.xyz${pathname}`} style={{ flexBasis: '30%' }}>
              <Image
                src={v4}
                // fill={true}
                placeholder="blur"
                // objectFit="cover"
                alt={'A picture of me at teamLab Tokyo'}
                height={200}
              />
            </a>
          )}
        </div>
      </>
    </>
  );
}
