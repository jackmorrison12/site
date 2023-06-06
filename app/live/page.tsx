import { Title } from '../../components/shared/Title';

export default async function Page() {
  return (
    <>
      <Title value="LIVE" offset="-313.32" />
      <p>Live data on what I&apos;m up to!</p>
    </>
  );
}

export const metadata = {
  title: 'Live',
  description: 'Live information',
};
