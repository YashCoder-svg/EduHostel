import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DemoBanner } from '@/components/DemoBanner';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hostelroomallocation-zeta.vercel.app'),
  title: 'EduHostel OS | Policy-Driven Hostel Allocation & Roommate Matching',
  description:
    'University residential housing management platform with deterministic constraint-satisfaction allocation, consented encrypted lifestyle roommate matching, and warden governance review.',
  keywords: [
    'hostel allocation',
    'roommate matching',
    'university housing',
    'Next.js',
    'deterministic allocation',
    'lifestyle compatibility',
    'campus governance',
  ],
  authors: [{ name: 'Yash Gupta', url: 'https://github.com/YashCoder-svg' }],
  openGraph: {
    title: 'EduHostel OS | Policy-Driven Hostel Allocation & Roommate Matching',
    description:
      'Institutional digital hostel inventory, policy-driven deterministic constraint allocation, consented lifestyle compatibility matching, and warden governance review.',
    url: 'https://hostelroomallocation-zeta.vercel.app',
    siteName: 'EduHostel OS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduHostel OS — Policy-Driven Hostel Allocation Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduHostel OS | Policy-Driven Hostel Allocation & Roommate Matching',
    description:
      'Institutional digital hostel inventory, policy-driven deterministic constraint allocation, consented lifestyle compatibility matching, and warden governance review.',
    images: ['/og-image.png'],
    creator: '@YashCoder',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${display.variable}`}>
      <body className="antialiased bg-[#090d16] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        <AppProvider>
          <DemoBanner />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
