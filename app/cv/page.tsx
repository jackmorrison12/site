import { Title } from '../../components/shared/Title';
import styles from './cv.module.scss';
import { SaveFile } from './SaveFile';
import { ClientEvent } from 'utils/analytics/ClientEvent';
import { CvContent } from './CvContent';
import { CvScaler } from './CvScaler';

export default async function Page() {
  return (
    <>
      <Title value="CV" offset="-151.03" />
      <div className={styles.overflowNotification}>
        <p>Looks like my CV is a bit big for this screen!</p>
        <ClientEvent action="download_cv" category="button_click" label="mobile">
          <a href="/files/jack-morrison-cv.pdf" download="jack-morrison-cv.pdf" className={styles.labelWrapper}>
            <button className={styles.downloadButtonMobile}>
              <SaveFile />
            </button>
            <p className={styles.label}>download</p>
          </a>
        </ClientEvent>
      </div>
      <div className={styles.overflowHandler}>
        <div className={styles.buttonWrapper}>
          <ClientEvent action="download_cv" category="button_click" label="desktop">
            <a href="/files/jack-morrison-cv.pdf" download="jack-morrison-cv.pdf">
              <button className={`${styles.downloadButton} ${styles.mobileHide}`}>
                <SaveFile />
              </button>
            </a>
          </ClientEvent>
        </div>
        <CvScaler>
          <CvContent />
        </CvScaler>
      </div>
    </>
  );
}

export const metadata = {
  title: 'CV',
  description: 'My CV',
};
