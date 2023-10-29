import _ from 'lodash';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';

import { getEvents } from '../../data-access/github/api/getEvents';

export const useHeatmap = async () => {
  const NUM_WEEKS = 9;
  const ONE_WEEK = 60 * 60 * 1000 * 24 * 7;

  // Zero indexed day of week
  const dayOfWeek = Number(formatInTimeZone(new Date(), 'Europe/London', 'i')) - 1;
  const currentDate = new Date(utcToZonedTime(new Date(), 'Europe/London').toDateString());
  currentDate.setDate(currentDate.getDate() - dayOfWeek);

  // dd/mm for the last NUM_WEEKS mondays
  const xLabels = new Array(NUM_WEEKS)
    .fill(0)
    .map((_, i) => formatInTimeZone(new Date(currentDate.getTime() - ONE_WEEK * i), 'Europe/London', 'dd/LL'))
    .reverse();

  const yLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let evts = undefined;
  try {
    evts = await getEvents({ perPage: 100 });
  } catch {
    return { data: [], xLabels: [], yLabels: [] };
  }

  const currentDay = new Date(utcToZonedTime(new Date(), 'Europe/London').toDateString()).valueOf();

  const groupedEvents = _.groupBy(evts, (e) => {
    if (!e.created_at) {
      return '';
    }
    const eventDay = new Date(utcToZonedTime(e.created_at, 'Europe/London').toDateString()).valueOf();

    const diffTime = Math.abs(currentDay.valueOf() - eventDay.valueOf());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  });

  const daysShown = (NUM_WEEKS - 1) * 7 + dayOfWeek + 1;

  const data1d = new Array(daysShown).fill(0);

  Object.entries(groupedEvents).forEach(([k, v]) => {
    if (Number(k) < daysShown) {
      data1d[daysShown - Number(k) - 1] = v.length;
    }
  });

  const data2d = _.compact(
    data1d.map(function (el, i) {
      if (i % 7 === 0) {
        return data1d.slice(i, i + 7);
      }
    }),
  );
  const data = data2d[0].map((_, colIndex) => data2d.map((row) => row[colIndex] ?? 0));

  return { data, xLabels, yLabels };
};
