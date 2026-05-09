import type { ReportTz } from '../data';
import styles from './TzNote.module.scss';

const LABELS: Record<ReportTz, string> = {
  'America/New_York': 'New York',
  'Europe/London': 'London',
};

export function TzNote({ tz, year }: { tz: ReportTz; year: number }) {
  const label = LABELS[tz];
  return (
    <span className={styles.note}>
      Using {label} timezone
      <span
        className={styles.icon}
        tabIndex={0}
        aria-label="Why this timezone?"
        data-tooltip={`I moved from London to New York in 2024, so ${year}'s wrapped uses ${label} timezone.`}
      >
        ⓘ
      </span>
    </span>
  );
}
