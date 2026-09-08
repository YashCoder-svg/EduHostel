import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
  title: 'EduHostel OS | Policy-Driven Hostel Allocation & Roommate Matching',
  description:
    'Institutional digital hostel inventory, policy-driven deterministic constraint allocation, consented lifestyle compatibility matching, and warden governance review.',
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
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
