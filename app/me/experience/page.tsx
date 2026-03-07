import { Title } from 'components/shared/Title';
import { getJobs } from 'content-access/jobs/jobs';
import { Timeline } from 'app/me/timeline/Timeline';

export default async function Page() {
  const jobs = getJobs()
    .map((j) => ({ type: 'JOB', ...j } as const))
    .filter((j) => !j.isHidden)
    .sort((j1, j2) => (new Date(j1.endDate) > new Date(j2.endDate) ? -1 : 1));

  return (
    <>
      <Title value="EXPERIENCE" offset="-676.89" />
      <h1>💼 Experience</h1>
      <Timeline items={jobs} itemstoDisplay={2} />
    </>
  );
}

export const metadata = {
  title: 'Experience',
  description: 'Work experience history',
};
