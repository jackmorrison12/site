import { z } from 'zod';

/** GitHub's own shading buckets, mapped to the 0–4 levels the graph renders. */
export const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

const contributionDay = z.object({
  date: z.string(),
  contributionLevel: z.enum(
    Object.keys(CONTRIBUTION_LEVELS) as [keyof typeof CONTRIBUTION_LEVELS, ...(keyof typeof CONTRIBUTION_LEVELS)[]],
  ),
});

export const contributionsSchema = z.object({
  data: z.object({
    user: z.object({
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          totalContributions: z.number(),
          weeks: z.array(z.object({ contributionDays: z.array(contributionDay) })),
        }),
      }),
    }),
  }),
});
