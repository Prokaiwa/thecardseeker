import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { EsubiProvider, ConnectedFloatingEsubi } from '@/components/esubi';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'The Card Seeker | Build Your Perfect Pokemon TCG Deck',
    template: '%s | The Card Seeker',
  },
  description:
    'Build competitive Pokemon TCG decks around your favorite Pokemon. AI-powered deck building, probability simulations, and meta analytics. Your deck-building companion.',
  keywords: [
    'Pokemon TCG',
    'Pokemon deck builder',
    'Pokemon cards',
    'TCG deck building',
    'Pokemon meta',
    'deck simulator',
    'Pokemon card database',
  ],
  authors: [{ name: 'The Card Seeker' }],
  creator: 'The Card Seeker',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'The Card Seeker',
    title: 'The Card Seeker | Build Your Perfect Pokemon TCG Deck',
    description:
      'Build competitive Pokemon TCG decks around your favorite Pokemon. AI-powered deck building, probability simulations, and meta analytics.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Card Seeker - Pokemon TCG Deck Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Card Seeker | Pokemon TCG Deck Builder',
    description: 'Build competitive decks around your favorite Pokemon.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen">
        <EsubiProvider>
          {children}
          <ConnectedFloatingEsubi position="bottom-right" collapsible={true} />
        </EsubiProvider>
      </body>
    </html>
  );
}
