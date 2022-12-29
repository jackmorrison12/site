// import { GetStaticProps } from 'next';

import styles from './index.module.scss';

import { Layout } from '../../components/Layout';
// import ProjectSummary from '../../components/Projects/ProjectSummary/ProjectSummary';

// import { getProjects } from '../../content-access/projects/projects';
// import { Project } from '../../content-access/projects/projects.types';

// type Props = {
//   posts: BlogPost[];
// };

const BlogPage = () => (
  <Layout title="Blog">
    <div className={styles.titleWrapper}>
      <span className={styles.title}>BLOG</span>
    </div>
    <p>This is where I can put any interesting musings</p>

    {/* <div className={styles.projectsWrapper}>
      {blogPosts.map((p) => (
        <ProjectSummary project={p} key={p.slug} />
      ))}
    </div> */}
  </Layout>
);

export default BlogPage;

// export const getStaticProps: GetStaticProps = async () => {
//   const projects = await getProjects().filter((p) => !p.isHidden);

//   return {
//     props: {
//       projects,
//     },
//   };
// };
