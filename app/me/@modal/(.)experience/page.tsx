import { getJobs } from 'content-access/jobs/jobs';
import Modal from 'components/shared/Modal/Modal';
import { Timeline } from 'app/me/timeline/Timeline';

export default async function ExperienceModal() {
  const jobs = getJobs()
    .map((j) => ({ type: 'JOB', ...j } as const))
    .filter((j) => !j.isHidden)
    .sort((j1, j2) => (new Date(j1.endDate) > new Date(j2.endDate) ? -1 : 1));

  return (
    <Modal>
      <h1>💼 Experience</h1>
      <Timeline items={jobs} itemstoDisplay={2} />
    </Modal>
  );
}
