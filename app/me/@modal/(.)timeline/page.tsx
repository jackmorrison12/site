import { getEducations } from 'content-access/education/education';
import { getJobs } from 'content-access/jobs/jobs';
import Modal from '../Modal';
import { Timeline } from 'app/me/timeline/Timeline';
import styles from 'app/me/timeline/timeline.module.scss';

export default async function TimelineModal() {
  const jobs = getJobs()
    .map((j) => ({ type: 'JOB', ...j } as const))
    .filter((j) => !j.isHidden)
    .sort((j1, j2) => (new Date(j1.endDate) > new Date(j2.endDate) ? -1 : 1));

  const educations = getEducations()
    .map((e) => ({ type: 'EDUCATION', ...e } as const))
    .filter((e) => !e.isHidden)
    .sort((e1, e2) => (new Date(e1.endDate) > new Date(e2.endDate) ? -1 : 1));

  return (
    <Modal>
      <h1>💼 Experience</h1>
      <Timeline items={jobs} itemstoDisplay={2} />
      <h1 className={styles.title}>🎓 Education</h1>
      <Timeline items={educations} itemstoDisplay={1} />
    </Modal>
  );
}
