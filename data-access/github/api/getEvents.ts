import 'server-only';
import { GITHUB_BASE_URL } from './urls';
import { eventSchema } from '../schemas/getEvents';

type GithubEventsRequest = {
  username?: string;
  perPage?: number;
  page?: number;
};

class GitHubError extends Error {}

export const getEvents = async ({ username = 'Jackmorrison12', perPage, page }: GithubEventsRequest) => {
  const url = `${GITHUB_BASE_URL}users/${username}/events?
${perPage ? `&per_page=${perPage}` : ''}
${page ? `&page=${page}` : ''}`;

  const res = await fetch(url, {
    headers: new Headers({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
    }),
    next: { revalidate: 60 * 3 },
  });

  if (!res.ok) {
    console.error(`Failed to fetch GitHub events: ${JSON.stringify(res)}`);
    throw new Error('Failed to fetch GitHub events');
  }

  //   return res.json();
  const parsedResult = eventSchema.safeParse(await res.json());

  if (!parsedResult.success) {
    console.error(`Failed to parse GitHub events API response: ${JSON.stringify(parsedResult.error.issues)}`);
    throw new GitHubError();
  }

  console.log(`Fetched events from GitHub API`);
  return parsedResult.data;
};
