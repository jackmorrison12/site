'use client';

import { useState } from 'react';
import type { ListeningPatterns as ListeningPatternsType } from '../data.types';
import styles from './ListeningPatterns.module.scss';

export function ListeningPatterns({ patterns }: { patterns: ListeningPatternsType }) {
  const maxDay = Math.max(...patterns.byDay.map((d) => d.count), 1);

  // Fill in missing hours with zero counts so all 24 bars render
  const hourMap = new Map(patterns.byHour.map((h) => [h.hour, h.count]));
  const allHours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: hourMap.get(i) ?? 0 }));

  const maxHour = Math.max(...allHours.map((h) => h.count), 1);
  const peakHour = allHours.reduce((max, h) => (h.count > max.count ? h : max), allHours[0]);

  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Listening Patterns</h2>

      <div className={styles.section}>
        <h3 className={styles.subheading}>By Day</h3>
        <div className={styles.barChart}>
          {patterns.byDay.map((day) => (
            <div
              key={day.day}
              className={styles.barGroup}
              onMouseEnter={() => setHoveredDay(day.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {hoveredDay === day.day && <span className={styles.tooltip}>{day.count.toLocaleString()}</span>}
              <div className={styles.barWrapper}>
                <div className={styles.bar} style={{ height: `${(day.count / maxDay) * 100}%` }} />
              </div>
              <span className={styles.barLabel}>{day.dayName.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheading}>By Hour</h3>
        <div className={styles.barChart}>
          {allHours.map((hour) => (
            <div
              key={hour.hour}
              className={styles.barGroup}
              onMouseEnter={() => setHoveredHour(hour.hour)}
              onMouseLeave={() => setHoveredHour(null)}
            >
              {hoveredHour === hour.hour && <span className={styles.tooltip}>{hour.count.toLocaleString()}</span>}
              <div className={styles.barWrapper}>
                <div
                  className={`${styles.bar} ${hour.hour === peakHour?.hour ? styles.barPeak : ''}`}
                  style={{ height: `${(hour.count / maxHour) * 100}%` }}
                />
              </div>
              <span className={styles.barLabel}>{hour.hour % 3 === 0 ? hour.hour : '\u00A0'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
