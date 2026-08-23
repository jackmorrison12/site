import 'server-only';
import { contributionsSchema, CONTRIBUTION_LEVELS } from '../schemas/getContributions';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionLevel
          }
        }
      }
    }
  }
}`;

export type ContributionWeek = number[];

/**
 * The real GitHub contribution calendar, as levels 0–4 per day (the same
 * buckets GitHub shades its own graph with), most recent week last.
 */
export const getContributions = async ({ username = 'jackmorrison12', weeks = 16 } = {}) => {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) throw new Error(`Failed to fetch GitHub contributions: ${res.status}`);

  const parsed = contributionsSchema.safeParse(await res.json());
  if (!parsed.success) throw new Error('Failed to parse GitHub contributions response');

  const calendar = parsed.data.data.user.contributionsCollection.contributionCalendar;

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks
      .slice(-weeks)
      .map((week) => week.contributionDays.map((day) => CONTRIBUTION_LEVELS[day.contributionLevel])),
  };
};
