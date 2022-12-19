// import { GetStaticProps } from 'next';

import styles from './index.module.scss';

import Layout from '../../components/Layout/Layout';
// import ProjectSummary from '../../components/Projects/ProjectSummary/ProjectSummary';

// import { getProjects } from '../../content-access/projects/projects';
// import { Project } from '../../content-access/projects/projects.types';

// type Props = {
//   posts: BlogPost[];
// };

const LivePage = () => (
  <Layout title="Live">
    <div className={styles.titleWrapper}>
      <span className={styles.title}>LIVE</span>
    </div>
    <p>Live data on what I'm up to!</p>

    {/* <div className={styles.projectsWrapper}>
      {blogPosts.map((p) => (
        <ProjectSummary project={p} key={p.slug} />
      ))}
    </div> */}
  </Layout>
);

export default LivePage;

// export const getStaticProps: GetStaticProps = async () => {
//   const projects = await getProjects().filter((p) => !p.isHidden);

//   return {
//     props: {
//       projects,
//     },
//   };
// };
