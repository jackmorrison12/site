import { GetStaticProps } from 'next';
import { Layout } from '../../components/Layout/Layout';
import { getProjects } from '../../content-access/projects/projects';
import { Project } from '../../content-access/projects/projects.types';
import styles from './index.module.scss';

type Props = {
  projects: Project[];
};

const CVPage = ({ projects }: Props) => (
  <Layout title="Me">
    <div className={styles.cvWrapper}>
      <div className={styles.summaryWrapper}>
        <h1>Jack Morrison</h1>
        <ul>
          <li>jack1morrison@sky.com</li>
          <li>+447775 101 516</li>
          <li>github.com/jackmorrison12</li>
          <li>linkedin.com/in/jackmorrison12</li>
          <li>jackmorrison.xyz</li>
        </ul>
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
        <h3>Proficient</h3>
        <ul>
          <li>Java</li>
          <li>Swift</li>
          <li>JavaScript</li>
          <li>Python</li>
          <li>C</li>
          <li>PHP</li>
          <li>HTML</li>
          <li>CSS</li>
        </ul>
        <h4>Familiar</h4>
        <ul>
          <li>Go</li>
          <li>C++</li>
          <li>Kotlin</li>
          <li>Haskell</li>
        </ul>
        <h4>Tools {'&'} Frameworks</h4>
        <ul>
          <li>Git React</li>
          <li>SQL</li>
          <li>Gatsby.js</li>
          <li>Node.js</li>
          <li>GraphQL</li>
          <li>Vue.js</li>
          <li>Docker</li>
          <li>Netlify</li>
          <li>Vim</li>
          <li>MongoDB</li>
          <li>LaTeX</li>
        </ul>
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
  </Layout>
);

export default CVPage;

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getProjects().filter((p) => p.onCV);

  return {
    props: {
      projects,
    },
  };
};
