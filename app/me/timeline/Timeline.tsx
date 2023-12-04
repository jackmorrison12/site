'use client';

import { Education } from 'content-access/education/education.types';
import { Job } from 'content-access/jobs/jobs.types';
import { FC, useState } from 'react';

import styles from './timeline.module.scss';

const dateToString = (date: string) =>
  !isNaN(new Date(date).valueOf())
    ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : date;

export const Timeline: FC<{
  items: Array<({ type: 'JOB' } & Job) | ({ type: 'EDUCATION' } & Education)>;
  itemstoDisplay: number;
}> = ({ items, itemstoDisplay }) => {
  const [isOpen, setIsOpen] = useState(new Array(items.length).fill(false));

  const [isExpanded, setIsExpanded] = useState(false);

  const trimmedItems = isExpanded ? items : items.slice(0, itemstoDisplay);

  const flipItem = (index: number) =>
    setIsOpen((prevState) => prevState.map((item, idx) => (idx === index ? !item : item)));

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.verticalLine} />
      <div>
        {trimmedItems.map((j, i) => (
          <div key={j.slug} id={j.slug} className={`${styles.item} ${styles.contentGroup}`} onClick={() => flipItem(i)}>
            {j.type === 'JOB' ? (
              <>
                <div className={styles.dateGroup}>
                  <div className={`${styles.circle} ${isOpen[i] && styles.fill}`}></div>
                  <div className={styles.date}>
                    {dateToString(j.startDate)} - {dateToString(j.endDate)}
                  </div>
                </div>
                <div className={styles.eventsGroup}>
                  <h1>
                    {j.position} @ {j.company} in {j.location}
                  </h1>
                  {isOpen[i] && (
                    <ul>
                      {j.cvhighlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.dateGroup}>
                  <div className={`${styles.circle} ${isOpen[i] && styles.fill}`}></div>
                  <div className={styles.date}>
                    {dateToString(j.startDate)} - {dateToString(j.endDate)}
                  </div>
                </div>
                <div className={styles.eventsGroup}>
                  <h1>
                    {j.title} - {j.subtitle}
                  </h1>
                  {isOpen[i] && (
                    <>
                      <h2>Grades:</h2>
                      <ul>
                        {j.gradeSummaries.map((grade, i) => (
                          <li key={i}>{grade}</li>
                        ))}
                      </ul>
                      {j.highlights.length > 0 && (
                        <>
                          <h2>Highlights:</h2>
                          <ul>
                            {j.highlights.map((h, i) => (
                              <li key={i}>
                                {h.name}
                                {h.score && `: ${h.score}`}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <h2>Commendations:</h2>
                      <ul>
                        {j.commendations.map((c, i) => (
                          <li key={i}>
                            {c.name} - {c.awarder} ({dateToString(c.date)})
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        <button className={styles.button} onClick={() => setIsExpanded((prev) => !prev)}>
          Show {isExpanded ? 'Less' : 'More'}
        </button>
      </div>
    </div>
  );
};
