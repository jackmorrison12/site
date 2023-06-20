'use client';

import { PDFExport as KendoPDFExport } from '@progress/kendo-react-pdf';
import { useRef } from 'react';

export const PDFExport = ({ children }: { children: React.ReactNode }) => {
  const cvRef = useRef<KendoPDFExport>(null);
  const downloadCV = () => {
    if (cvRef.current) {
      cvRef.current.save();
    }
  };
  return (
    <>
      <button onClick={downloadCV}>Download CV</button>
      <KendoPDFExport
        ref={cvRef}
        paperSize="auto"
        margin={0}
        fileName="jack-morrison-cv"
        author="Jack Morrison"
        creator="Jack Morrison"
        keywords="Jack Morrison, Imperial College London, Bloomberg, CV"
        producer="https://jackmorrison.xyz"
        subject="Jack Morrison's CV"
        title="Jack Morrison's CV"
      >
        {children}
      </KendoPDFExport>
    </>
  );
};
