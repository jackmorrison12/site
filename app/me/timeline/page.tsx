// TODO: This should be a modal - look at the vercel tutorials

import { Title } from 'components/shared/Title';
import { getEducations } from 'content-access/education/education';
import { getJobs } from 'content-access/jobs/jobs';

const dateToString = (date: string) =>
  !isNaN(new Date(date).valueOf())
    ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : date;

export default async function Page() {
  const jobs = getJobs().map((j) => ({ type: 'JOB', ...j } as const));
  const educations = getEducations().map((e) => ({ type: 'EDUCATION', ...e } as const));

  const combined = [...jobs, ...educations]
    .filter((c) => !c.isHidden)
    .sort((c1, c2) => (new Date(c1.endDate) > new Date(c2.endDate) ? -1 : 1));

  return (
    <>
      <Title value="TIMELINE" offset="-669.62" />
      {combined.map((j) =>
        j.type === 'JOB' ? (
          <div id={j.slug} key={j.slug}>
            <h1>{j.company}</h1>
            <h2>
              {dateToString(j.startDate)} - {dateToString(j.endDate)}
            </h2>
          </div>
        ) : (
          <div id={j.slug} key={j.slug}>
            <h1>{j.title}</h1>
            <h2>
              {dateToString(j.startDate)} - {dateToString(j.endDate)}
            </h2>
          </div>
        ),
      )}
    </>
  );
}
