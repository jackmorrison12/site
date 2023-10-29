import { Metadata } from 'next';
import { Layout } from '../components/Layout';
import { GlobalStyle } from '../utils/styles/globalStyles';
import { Providers } from './providers';
import StyledComponentsRegistry from './registry';

import { Poppins } from 'next/font/google';

const APP_NAME = 'Jack Morrison';
const APP_DEFAULT_TITLE = 'Jack Morrison';
const APP_TITLE_TEMPLATE = '%s | Jack Morrison';
const APP_DESCRIPTION = "Jack's Personal Website";

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
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  authors: { name: 'Jack Morrison', url: 'https://jackmorrison.xyz' },
  keywords: ['Software Engineer', 'Imperial College London', 'Bloomberg'],
  viewport: { initialScale: 1, width: 'device-width' },
  other: { charSet: 'utf-8' },
  manifest: '/manifest.json',
  themeColor: 'rgb(22, 22, 22)',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    creator: '@jsm_99',
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};
