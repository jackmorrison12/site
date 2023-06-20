import { format } from 'date-fns';

import { Title } from '../../components/shared/Title';
import { getEvents } from '../../data-access/github/api/getEvents';
import { getRecentTracks } from '../../data-access/lastfm/api/getRecentTracks';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import _ from 'lodash';

export default async function Page() {
  const topTracks = await getTopTracks({ limit: 10 });
  const recentTracks = await getRecentTracks({});
  const events = await getEvents({ perPage: 100 });
  const filteredEvents = events.filter((e) => e.public);
  // console.log(filteredEvents);

  const squashedEvents: typeof filteredEvents = [];
  let currentEvent: typeof filteredEvents[0] | undefined;

  events.forEach((e) => {
    if (!currentEvent) {
      currentEvent = e;
      return;
    }
    // Merge push events
    if (
      currentEvent.type === 'PushEvent' &&
      e.type === 'PushEvent' &&
      new Date(currentEvent.created_at!).getDate() === new Date(e.created_at!).getDate() &&
      currentEvent.repo.id === e.repo.id
    ) {
      currentEvent.payload.size += e.payload.size;
    } else {
      squashedEvents.push(currentEvent);
      currentEvent = e;
    }
  });
  console.log(events.length);
  console.log(squashedEvents.length);

  const eventToMessage = (e) => {
    switch (e.type) {
      case 'PushEvent':
        return `Pushed ${e.payload.size} commits to ${e.public ? e.repo.name : 'a private repo'}`;
      case 'DeleteEvent': {
        switch (e.payload.ref_type) {
          case 'repository':
            return e.public ? `Deleted a repo called ${e.repo.name}` : 'Created a private repo';
          case 'branch':
            return e.public
              ? `Deleted branch ${e.payload.ref} in ${e.repo.name}`
              : 'Deleted a branch in a private repo';
          case 'tag':
            return e.public ? `Deleted tag ${e.payload.ref} in ${e.repo.name}` : 'Deleted a tag in a private repo';
        }
      }
      case 'CommitCommentEvent':
        return 'CommitCommentEvent';
      case 'CreateEvent': {
        switch (e.payload.ref_type) {
          case 'repository':
            return e.public ? `Created a repo called ${e.repo.name}` : 'Created a private repo';
          case 'branch':
            return e.public
              ? `Created branch ${e.payload.ref} in ${e.repo.name}`
              : 'Created a branch in a private repo';
          case 'tag':
            return e.public ? `Created tag ${e.payload.ref} in ${e.repo.name}` : 'Created a tag in a private repo';
        }
      }
      case 'ForkEvent':
        return 'ForkEvent';
      case 'IssueCommentEvent':
        return 'IssueCommentEvent';
      case 'IssuesEvent':
        return 'IssuesEvent';
      case 'PublicEvent':
        return 'PublicEvent';
      case 'PullRequestEvent':
        return 'PullRequestEvent';
      case 'PullRequestReviewCommentEvent':
        return 'PullRequestReviewCommentEvent';
      case 'WatchEvent':
        return 'WatchEvent';
    }
  };

  const finalEvents = squashedEvents.map((e) => ({ ...e, message: eventToMessage(e) }));

  const groupedEvents = _.groupBy(finalEvents, (e) => format(new Date(e.created_at), 'do LLLL yyyy'));
  console.log(groupedEvents);

  console.log(Object.entries(groupedEvents).map(([date, e]) => e));

  return (
    <>
      <Title value="LIVE" offset="-313.32" />
      <p>GitHub Events</p>
      <ul>
        {Object.entries(groupedEvents).map(([date, events]) => (
          // <li key={e.id}>
          //   {format(new Date(e.created_at), 'do LLLL yyyy @ h:mm aaa')}: {e.message}
          // </li>
          <li key={date}>
            {date}:
            <ul>
              {events.map((e) => (
                <li key={e.id}>
                  {format(new Date(e.created_at), 'h:mm aaa')}: {e.message}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p>Recent tracks</p>
      <ul>
        {recentTracks.recenttracks.track.map((t) => (
          <li key={`${t.name} ${t.artist.name}`}>
            <a href={t.url}>
              {t.date?.toString() || 'Now Playing'} - {t.name}
            </a>
          </li>
        ))}
      </ul>
      <p>Top tracks</p>
      <ul>
        {topTracks.toptracks.track.map((t) => (
          <li key={`${t.name} ${t.artist.name}`}>
            <a href={t.url}>
              {t.playcount} - {t.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export const metadata = {
  title: 'Live',
  description: 'Live information',
};
