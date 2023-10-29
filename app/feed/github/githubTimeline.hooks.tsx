import _ from 'lodash';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';

import { getEvents } from '../../../data-access/github/api/getEvents';

export const useGithubTimeline = async () => {
  const timezone = formatInTimeZone(new Date(), 'Europe/London', 'z') === 'GMT' ? 'GMT' : 'BST';

  let events = undefined;
  try {
    events = await getEvents({ perPage: 100 });
  } catch {
    return { events: [], timezone };
  }

  type Event = (typeof events)[0];

  const squashedEvents: typeof events = [];
  let currentEvent: Event | undefined;

  events.forEach((e) => {
    if (!currentEvent) {
      currentEvent = e;
      return;
    }
    if (
      currentEvent.type === 'PushEvent' &&
      e.type === 'PushEvent' &&
      currentEvent.created_at &&
      e.created_at &&
      new Date(utcToZonedTime(currentEvent.created_at, 'Europe/London').toDateString()).getDate() ===
        new Date(utcToZonedTime(e.created_at, 'Europe/London').toDateString()).getDate() &&
      currentEvent.repo.id === e.repo.id &&
      typeof currentEvent.payload.size === 'number' &&
      typeof e.payload.size === 'number'
    ) {
      currentEvent.payload.size += e.payload.size;
    } else {
      squashedEvents.push(currentEvent);
      currentEvent = e;
    }
  });
  squashedEvents.push(currentEvent as Event);

  const eventToMessage = (e: Event) => {
    switch (e.type) {
      case 'PushEvent':
        return (
          <span>
            Pushed{' '}
            <b>
              {e.payload.size as number} commit{(e.payload.size as number) > 1 ? 's' : ''}
            </b>{' '}
            to{' '}
            {e.public ? (
              <b>
                <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
              </b>
            ) : (
              'a private repo'
            )}
          </span>
        );
      case 'DeleteEvent': {
        switch (e.payload.ref_type) {
          case 'repository':
            return e.public ? (
              <span>
                Deleted repo <b>{e.repo.name}</b>
              </span>
            ) : (
              'Deleted a private repo'
            );
          case 'branch':
            return e.public ? (
              <span>
                Deleted branch <b>{e.payload.ref as string}</b> in{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
                </b>
              </span>
            ) : (
              'Deleted a branch in a private repo'
            );
          case 'tag':
            return e.public ? (
              <span>
                Deleted tag <b>{e.payload.ref as string}</b> in{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
                </b>
              </span>
            ) : (
              'Deleted a tag in a private repo'
            );
        }
      }
      case 'CommitCommentEvent':
        // TODO implement commit comment event
        return null;
      case 'CreateEvent': {
        switch (e.payload.ref_type) {
          case 'repository':
            return e.public ? (
              <span>
                Created{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
                </b>
              </span>
            ) : (
              'Created a private repo'
            );
          case 'branch':
            return e.public ? (
              <span>
                Created branch{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}/tree/${e.payload.ref}`}>{e.payload.ref as string}</a>
                </b>{' '}
                in{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
                </b>
              </span>
            ) : (
              'Created a branch in a private repo'
            );
          case 'tag':
            return e.public ? (
              <span>
                Created tag{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}/releases/tag/${e.payload.ref}`}>
                    {e.payload.ref as string}
                  </a>
                </b>{' '}
                in{' '}
                <b>
                  <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
                </b>
              </span>
            ) : (
              'Created a tag in a private repo'
            );
        }
      }
      case 'ForkEvent':
        // TODO implement fork events
        return null;
      case 'IssueCommentEvent':
        // TODO implement issue comment event
        return null;
      case 'IssuesEvent':
        switch (e.payload.action) {
          case 'opened':
            return e.public ? (
              <span>
                Opened{' '}
                <a href={e.payload.issue?.html_url}>
                  <b>{e.payload.issue?.title}</b>
                </a>{' '}
                in{' '}
                <a href={`https://github.com/${e.repo.name}`}>
                  <b>{e.repo.name}</b>
                </a>
              </span>
            ) : (
              'Opened an issue in a private repo'
            );
          case 'closed':
            return e.public ? (
              <span>
                Closed{' '}
                <a href={e.payload.issue?.html_url}>
                  <b>{e.payload.issue?.title}</b>
                </a>{' '}
                in{' '}
                <a href={`https://github.com/${e.repo.name}`}>
                  <b>{e.repo.name}</b>
                </a>
              </span>
            ) : (
              'Closed an issue in a private repo'
            );
          case 'reopened':
            return e.public ? (
              <span>
                Repened{' '}
                <a href={e.payload.issue?.html_url}>
                  <b>{e.payload.issue?.title}</b>
                </a>{' '}
                in{' '}
                <a href={`https://github.com/${e.repo.name}`}>
                  <b>{e.repo.name}</b>
                </a>
              </span>
            ) : (
              'Reopened an issue in a private repo'
            );
          case 'assigned':
            // TODO Implement issue assigned
            return null;
          case 'unassigned':
            // TODO Implement issue unassigned
            return null;
          case 'labeled':
            // TODO Implement labeled issue
            return null;
          case 'unlabeled':
            // TODO Implement unlabeled issue
            return null;
        }
        return 'IssuesEvent';
      case 'PublicEvent':
        return (
          <span>
            Made{' '}
            <a href={`https://github.com/${e.repo.name}`}>
              <b>{e.repo.name}</b>
            </a>{' '}
            public!
          </span>
        );
      case 'PullRequestEvent':
        switch (e.payload.action) {
          case 'opened':
            return e.public ? (
              <span>
                Opened{' '}
                <a href={(e.payload.pull_request as { html_url: string }).html_url}>
                  <b>{(e.payload.pull_request as { title: string }).title}</b>
                </a>{' '}
                in{' '}
                <a href={`https://github.com/${e.repo.name}`}>
                  <b>{e.repo.name}</b>
                </a>
              </span>
            ) : (
              'Opened a pull request in a private repo'
            );
          case 'closed':
            return e.public ? (
              <span>
                Closed{' '}
                <a href={(e.payload.pull_request as { html_url: string }).html_url}>
                  <b>{(e.payload.pull_request as { title: string }).title}</b>
                </a>{' '}
                in{' '}
                <a href={`https://github.com/${e.repo.name}`}>
                  <b>{e.repo.name}</b>
                </a>
              </span>
            ) : (
              'Closed a pull request in a private repo'
            );
          case 'reopened':
            return e.public ? (
              <span>
                Reopened{' '}
                <a href={(e.payload.pull_request as { html_url: string }).html_url}>
                  {(e.payload.pull_request as { title: string }).title}
                </a>{' '}
                in <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
              </span>
            ) : (
              'Reopened a pull request in a private repo'
            );
          case 'assigned':
            // TODO Implement assigned PR
            return null;
          case 'unassigned':
            // TODO Implement unassigned PR
            return null;
          case 'labeled':
            // TODO Implement labeled PR
            return null;
          case 'unlabeled':
            // TODO Implement unlabeled PR
            return null;
          case 'review_requested':
            // TODO Implement review requests on PR
            return null;
          case 'review_request_removed':
            // TODO Implement review request remved from PR
            return null;
          case 'synchronize':
            // TODO PR synchronize
            return null;
        }
      case 'PullRequestReviewCommentEvent':
        // TODO Implement PR review comment
        return null;
      case 'WatchEvent':
        return (
          <span>
            Starred{' '}
            <b>
              <a href={`https://github.com/${e.repo.name}`}>{e.repo.name}</a>
            </b>
          </span>
        );
    }
  };

  const finalEvents = squashedEvents.map((e) => ({ ...e, message: eventToMessage(e) }));

  const groupedEvents = _.groupBy(finalEvents, (e) =>
    e.created_at ? formatInTimeZone(new Date(e.created_at), 'Europe/London', 'do LLLL yyyy') : '',
  );

  return { events: groupedEvents, timezone };
};
