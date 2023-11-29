'use client';

import { Education } from 'content-access/education/education.types';
import { Job } from 'content-access/jobs/jobs.types';
import { FC, useState } from 'react';

import styles from './timeline.module.scss';

const dateToString = (date: string) =>
  !isNaN(new Date(date).valueOf())
    ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : date;

export const Timeline: FC<{ items: Array<({ type: 'JOB' } & Job) | ({ type: 'EDUCATION' } & Education)> }> = ({
  items,
}) => {
  const [isOpen, setIsOpen] = useState(new Array(items.length).fill(false));

  const flipItem = (index: number) =>
    setIsOpen((prevState) => prevState.map((item, idx) => (idx === index ? !item : item)));

  return (
    <div>
      {items.map((j, i) => (
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
                {/* <h2>{j.position}</h2>
                <h1>{j.company}</h1>
                <h2>{j.location}</h2> */}
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
                <div className={styles.circle}></div>
                <div className={styles.date}>
                  {dateToString(j.startDate)} - {dateToString(j.endDate)}
                </div>
              </div>
              <div className={styles.eventsGroup}>
                <h1>
                  {j.title} - {j.subtitle}
                </h1>
                {/* <h2>{j.subtitle}</h2>
                <h1>{j.title}</h1> */}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
