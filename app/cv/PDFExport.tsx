/**
 * This component is only needed locally to export the CV as a PDF.
 * It is not used in production as the PDF export is handled server-side.
 * "@progress/kendo-react-pdf": "^5.19.0" needs to be added to package.json for this to work.
 */

// 'use client';

// import { PDFExport as KendoPDFExport } from '@progress/kendo-react-pdf';
// import { ReactNode, useRef } from 'react';

// export const PDFExport = ({ children }: { children: ReactNode }) => {
//   const cvRef = useRef<KendoPDFExport>(null);
//   const downloadCV = () => {
//     if (cvRef.current) {
//       cvRef.current.save();
//     }
//   };
//   return (
//     <>
//       <button onClick={downloadCV}>Download CV</button>
//       <KendoPDFExport
//         ref={cvRef}
//         paperSize="auto"
//         margin={0}
//         fileName="jack-morrison-cv"
//         author="Jack Morrison"
//         creator="Jack Morrison"
//         keywords="Jack Morrison, Imperial College London, Bloomberg, CV"
//         producer="https://jackmorrison.xyz"
//         subject="Jack Morrison's CV"
//         title="Jack Morrison's CV"
//       >
//         {children}
//       </KendoPDFExport>
//     </>
//   );
// };
