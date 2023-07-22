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
      <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '20px' }}>
        <div
          style={{
            height: '100%',
            width: '5px',
            backgroundColor: 'var(--colours_primary_default)',
            marginRight: '20px',
            marginLeft: '20px',
          }}
        ></div>
        <div>
          {Object.entries(events).map(([date, evts]) => (
            <div key={date} style={{ paddingBottom: '30px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  right: '42.5px',
                  position: 'relative',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    padding: '15px',
                    borderRadius: '100px',
                    backgroundColor: 'var(--colours_background_default)',
                    border: '5px solid var(--colours_primary_default)',
                  }}
                />
                <p
                  style={{
                    fontWeight: 'var(--fontWeights_thick)',
                    textTransform: 'uppercase',
                  }}
                >
                  {date}
                </p>
              </div>
              {evts.map(
                (e) =>
                  e.message && (
                    <div
                      key={e.id}
                      style={{ display: 'flex', flexDirection: 'row', gap: '10px', paddingBottom: '5px' }}
                    >
                      <p
                        style={{
                          fontWeight: 'var(--fontWeights_thick)',
                          paddingLeft: '30px',
                          flex: 'none',
                          minWidth: '80px',
                        }}
                      >
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
