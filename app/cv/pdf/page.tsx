import { CvContent } from '../CvContent';

export default function Page() {
  return (
    <>
      {/* Match sidebar colour so any sub-pixel margin gap is invisible. */}
      <style>{`html, body { background-color: #1c1c1c !important; margin: 0 !important; padding: 0 !important; }`}</style>
      <CvContent />
    </>
  );
}

export const metadata = {
  robots: 'noindex',
};
