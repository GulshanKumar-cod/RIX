// src/app/layout.js
import { Inter, DM_Sans } from 'next/font/google';
import '@/styles/bootstrap_custom.css';
import './reset.css';
import './globals.css';
import LayoutWrapper from '@/components/layoutwrapper/layoutwrapper';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  title: 'RIX',
  description: 'Access wealth of global research data...',
  manifest: '/manifest.json',
  themeColor: '#0b1220',
  icons: {
    icon: '/icons/logo.png',
    apple: '/icons/logo.png',
    shortcut: '/icons/logo.png',
  },
  appleWebApp: {
    capable: true,
    title: 'RIX',
    statusBarStyle: 'black-translucent',
  },
};


export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
           <SpeedInsights />
      </body>
    </html>
  );
}
