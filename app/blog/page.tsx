import { Metadata, ResolvingMetadata } from 'next';
import { Title } from '../../components/shared/Title';

export default async function Page() {
  return (
    <>
      <Title value="BLOG" offset="-411.65" />
      <p>This is where I can put any interesting musings</p>
    </>
  );
}

export const metadata = {
  title: 'Blog',
  description: 'My musings',
};
