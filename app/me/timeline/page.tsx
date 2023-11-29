// TODO: This should be a modal - look at the vercel tutorials

import { Title } from 'components/shared/Title';
import { getEducations } from 'content-access/education/education';
import { getJobs } from 'content-access/jobs/jobs';

import styles from './timeline.module.scss';
import { Timeline } from './Timeline';

export default async function Page() {
  const jobs = getJobs().map((j) => ({ type: 'JOB', ...j } as const));
  const educations = getEducations().map((e) => ({ type: 'EDUCATION', ...e } as const));

  const combined = [...jobs, ...educations]
    .filter((c) => !c.isHidden)
    .sort((c1, c2) => (new Date(c1.endDate) > new Date(c2.endDate) ? -1 : 1));

  return (
    <>
      <Title value="TIMELINE" offset="-669.62" />
      {/* Filter by education or jobs - default to both */}
      {/* How should I emphasise current? */}
      {/* <button>Education</button>
      <button>Jobs</button>
      <button>Most recent</button >*/}
      <div className={styles.timelineWrapper}>
        <div className={styles.verticalLine} />
        <Timeline items={combined} />
      </div>
    </>
  );
}
