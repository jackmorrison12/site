import { Title } from 'components/shared/Title';
import { getEducations } from 'content-access/education/education';
import { Timeline } from 'app/me/timeline/Timeline';

export default async function Page() {
  const educations = getEducations()
    .map((e) => ({ type: 'EDUCATION', ...e } as const))
    .filter((e) => !e.isHidden)
    .sort((e1, e2) => (new Date(e1.endDate) > new Date(e2.endDate) ? -1 : 1));

  return (
    <>
      <Title value="EDUCATION" offset="-669.18" />
      <h1>🎓 Education</h1>
      <Timeline items={educations} itemstoDisplay={1} />
    </>
  );
}

export const metadata = {
  title: 'Education',
  description: 'Education history',
};
