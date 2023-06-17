import { Title } from '../../components/shared/Title';
import { getProjects } from '../../content-access/projects/projects';
import styles from './cv.module.scss';

export default async function Page() {
  const projects = await getProjects().filter((p) => p.onCV);

  return (
    <>
      <Title value="CV" offset="-151.03" />
      <div className={styles.cvWrapper}>
        <div className={styles.summaryWrapper}>
          <h1>Jack Morrison</h1>
          <a href="mailto:jack1morrison@sky.com">
            <p>jack1morrison@sky.com</p>
          </a>
          <a href="sms:+447775101516">
            <p>+447775 101 516</p>
          </a>
          <a href="https://github.com/jackmorrison12">
            <p>github.com/jackmorrison12</p>
          </a>
          <a href="https://linkedin.com/in/jackmorrison12">
            <p>linkedin.com/in/jackmorrison12</p>
          </a>
          <a href="https://jackmorrison.xyz">
            <p>jackmorrison.xyz</p>
          </a>
          <h2>Education</h2>
          <h3>Imperial College London</h3>
          <h4>MEng Computing</h4>
          <i>2017-2022</i>
          <ul>
            <li>Final Grade: First </li>
            <li>IC Skydiving Secretary &apos;20/21</li>
          </ul>
          <h3>Westcliff High School for Boys Sixth Form</h3>
          <i>2015-2017</i>
          <ul>
            <li>A Levels (Mathematics, Further Maths, Computing, Physics) - 4 A*</li>
            <li>EPQ (Computer Assisted Proofs) - A</li>
          </ul>
          <h2>Technical Experience</h2>
          <h3>Languages</h3>
          <div className={styles.pillWrapper}>
            <div className={styles.pill}>TypeScript</div>
            <div className={styles.pill}>Python</div>
            <div className={styles.pill}>HTML & CSS</div>
            <div className={styles.pill}>JavaScript</div>
            <div className={styles.pill}>C</div>
            <div className={styles.pill}>Swift</div>
          </div>
          <h3>Tools & Frameworks</h3>
          <div className={styles.pillWrapper}>
            <div className={styles.pill}>React</div>
            <div className={styles.pill}>SQL</div>
            <div className={styles.pill}>MongoDB</div>
            <div className={styles.pill}>Next.js</div>
            <div className={styles.pill}>Git</div>
            <div className={styles.pill}>Docker</div>
            <div className={styles.pill}>Solr</div>
            <div className={styles.pill}>Kafka</div>
            <div className={styles.pill}>FastAPI</div>
          </div>
          <h2>Skills</h2>
          <h3>German Language Proficiency</h3>
          <p>I have achieved B1+ standard of the Common European Framework of Reference alongside my degree studies</p>

          <h3>Web Design</h3>
          <p>
            I have created many full stack websites, increasing my familiarity with technologies such as React, Vue and
            Node.js
          </p>
          <h3>Teaching</h3>
          <p>
            I taught an &apos;Introduction to Python&apos; course to a class of 15 year old students, as well as a
            Robotics course to a group of Primary School children
          </p>
        </div>
        <div className={styles.mainWrapper}>
          <h2>Experience</h2>
          <h3>Bloomberg</h3>
          <h4>Software Engineer</h4>
          <h4>September 2021 - Present</h4>
          <ul>
            <li>Currently working on Bloomberg&apos;s Web and API enterprise data product: DATA{'<GO>'}</li>
            <li>Working full stack using a modern React/TypeScript frontend and Python backend</li>
            <li>
              Leading multiple large-scale multi-team projects, including migrating our site to cloud-based hosting
            </li>
            <li>Member of the Bloomberg Web UI standards committee</li>
          </ul>
          <h3>Nextjump</h3>
          <h4>Software Engineer</h4>
          <h4>June - September 2019, July - October 2020</h4>
          <ul>
            <li>
              Worked on mission-critical features, improving existing and creating new systems to prepare for increased
              site traffic and revenue in Q4 2020
            </li>
            <li>Owned multiple full-stack projects created using Vue.js, PHP and Go</li>
            <li>
              Collaborated remotely with a team of engineers, UX designers and business associates to research and
              implement solutions on how to improve UX
            </li>
            <li>
              Ran the UK Office&apos;s &apos;Adopt-a-School&apos; scheme, teaching robotics, teamwork and public
              speaking to underprivileged children
            </li>{' '}
          </ul>
          <h3>Facebook</h3>
          <h4>Hack-a-Project Participant</h4>
          <h4>October - November 2018</h4>
          <ul>
            <li>
              Participated in an programme at Facebook with the goal of creating an application to &apos;Bring
              Communities Together&apos;
            </li>
            <li> Used the scrum agile methodology, working in 2-week sprints</li>
            <li>Created MentorMe, a mentoring app made using React.js and Node.js</li>
          </ul>
          <h2>Projects</h2>
          {projects.map((item) => (
            <div key={item.slug}>
              <a href={'https://jackmorrison.xyz' + item.slug}>
                <h3>{item.title}</h3>
              </a>
              <p>
                {new Date(item.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} -{' '}
                {new Date(item.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              {item.highlights && (
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
