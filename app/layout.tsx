import { Metadata } from 'next';
import { Layout } from '../components/Layout';
import { GlobalStyle } from '../utils/styles/globalStyles';
import { Providers } from './providers';
import StyledComponentsRegistry from './registry';

import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        <Providers>
          <StyledComponentsRegistry>
            <GlobalStyle />
            <Layout>{children}</Layout>
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Jack Morrison',
    default: 'Jack Morrison',
  },
  description: "Jack's Personal Website",
  applicationName: 'Jack Morrison',
  authors: { name: 'Jack Morrison', url: 'https://jackmorrison.xyz' },
  keywords: ['Software Engineer', 'Imperial College London', 'Bloomberg'],
  viewport: { initialScale: 1, width: 'device-width' },
  twitter: { creator: '@jsm_99' },
  other: { charSet: 'utf-8' },
};
