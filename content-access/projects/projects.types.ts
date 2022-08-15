enum ProjectType {
  UniProject = 'Uni Project',
  Hackathon = 'Hackathon',
  SchoolProject = 'School Project',
  PersonalProject = 'Personal Project',
}

export type Project = {
  title: string;
  slug?: string;
  type: ProjectType;
  onHomepage: boolean;
  onCV: boolean;
  isFeatured: boolean;
  isHidden: boolean;
  heroImg: string;
  bannerImg: string;
  description: string;
  startDate: string;
  endDate: string;
  sources?: { name: string; url: string; iconImg: string };
  tags: string[];
  highlights?: string[];
};
