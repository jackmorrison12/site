import { Title } from '../../components/shared/Title';
import Credits from './credits.mdx';

export default async function Page() {
  return (
    <>
      <Title value="CREDITS" offset="-551.74" />
      <Credits />
    </>
  );
}

export const metadata = {
  title: 'Credits',
  description: 'Credits for insipration',
};
