import { ReactNode, Suspense } from 'react';
import styles from './ContributionGraph.module.scss';
import { getContributions } from 'data-access/github/api/getContributions';

type Props = {
  /** 'paper' is the pinned printout; 'card' is the larger one in the story card. */
  variant?: 'paper' | 'card';
};

const WEEKS = { paper: 16, card: 26 } as const;

const Grid = ({ variant = 'paper', children }: Props & { children?: ReactNode }) => (
  <span
    className={`${styles.grid} ${variant === 'card' ? styles.card : ''}`}
    style={{ aspectRatio: `${WEEKS[variant]} / 7` }}
  >
    {children}
  </span>
);

export const ContributionGraph = ({ variant = 'paper' }: Props) => (
  // Empty grid while loading, or if GitHub is unreachable — never fake squares.
  <Suspense fallback={<Grid variant={variant} />}>
    <ContributionGraphAsync variant={variant} />
  </Suspense>
);

const ContributionGraphAsync = async ({ variant = 'paper' }: Props) => {
  let data;
  try {
    data = await getContributions({ weeks: WEEKS[variant] });
  } catch {
    return <Grid variant={variant} />;
  }

  const grid = (
    <Grid variant={variant}>
      {data.weeks.map((week, w) =>
        week.map((level, d) => <span key={`${w}-${d}`} className={styles.cell} data-level={level} />),
      )}
    </Grid>
  );

  if (variant !== 'card') return grid;

  return (
    <span className={styles.cardWrap}>
      {grid}
      <span className={styles.total}>
        <strong>{data.totalContributions.toLocaleString()}</strong> contributions in the last year
      </span>
    </span>
  );
};
