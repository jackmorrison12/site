import { Project } from '../../../content-access/projects/projects.types';

export const useProjectHeader = ({ project }: { project: Project }) => {
  const startDate = new Date(Date.parse(project.startDate)).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'long',
  });

  const endDate = new Date(Date.parse(project.endDate)).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'long',
  });

  return { startDate, endDate };
};
