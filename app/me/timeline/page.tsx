// TODO: This should be a modal - look at the vercel tutorials

import { Title } from 'components/shared/Title';
import { getEducations } from 'content-access/education/education';
import { getJobs } from 'content-access/jobs/jobs';

import styles from './timeline.module.scss';
import { Timeline } from './Timeline';

export default async function Page() {
  const jobs = getJobs()
    .map((j) => ({ type: 'JOB', ...j } as const))
    .filter((j) => !j.isHidden)
    .sort((j1, j2) => (new Date(j1.endDate) > new Date(j2.endDate) ? -1 : 1));

  const educations = getEducations()
    .map((e) => ({ type: 'EDUCATION', ...e } as const))
    .filter((e) => !e.isHidden)
    .sort((e1, e2) => (new Date(e1.endDate) > new Date(e2.endDate) ? -1 : 1));

  return (
    <>
      <Title value="TIMELINE" offset="-669.62" />
      <h1>💼 Experience</h1>
      <Timeline items={jobs} itemstoDisplay={2} />
      <h1 className={styles.title}>🎓 Education</h1>
      <Timeline items={educations} itemstoDisplay={1} />
    </>
  );
}
