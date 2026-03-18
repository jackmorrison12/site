import { getEducations } from 'content-access/education/education';
import Modal from 'components/shared/Modal/Modal';
import { Timeline } from 'app/me/timeline/Timeline';

export default async function EducationModal() {
  const educations = getEducations()
    .map((e) => ({ type: 'EDUCATION', ...e } as const))
    .filter((e) => !e.isHidden)
    .sort((e1, e2) => (new Date(e1.endDate) > new Date(e2.endDate) ? -1 : 1));

  return (
    <Modal>
      <h1>🎓 Education</h1>
      <Timeline items={educations} itemstoDisplay={1} />
    </Modal>
  );
}
