import { formatInTimeZone } from 'date-fns-tz';

import { useGithubTimeline } from './githubTimeline.hooks';

import styles from './github.module.scss';

export default async function Page() {
  const { events, timezone } = await useGithubTimeline();

  return (
    <>
      <h1>
        Recent GitHub Activity
        <span className={styles.timezone}>in {timezone}</span>
      </h1>
      <div className={styles.timelineWrapper}>
        <div className={styles.verticalLine} />
        <div>
          {Object.entries(events).map(([date, evts]) => (
            <div key={date} className={styles.contentGroup}>
              <div className={styles.dateGroup}>
                <div className={styles.circle} />
                <p className={styles.date}>{date}</p>
              </div>
              {evts.map(
                (e) =>
                  e.message && (
                    <div key={e.id} className={styles.eventsGroup}>
                      <p className={styles.time}>
                        {e.created_at ? `${formatInTimeZone(new Date(e.created_at), 'Europe/London', 'h:mm aa')} ` : ''}
                      </p>
                      <p>{e.message}</p>
                    </div>
                  ),
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
