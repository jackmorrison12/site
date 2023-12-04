export type Education = {
  title: string;
  subtitle: string;
  slug: string;
  onCV: boolean;
  isHidden: boolean;
  url: string;
  startDate: string;
  endDate: string;
  grades: string[];
  gradeSummaries: string[];
  highlights: Array<{ name: string; score: string }>;
  commendations: Array<{ date: string; name: string; awarder: string }>;
};
