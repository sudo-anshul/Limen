import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeSkinProvider } from '@/components/theme-skin-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Limen — Preflight Desk for Web Launches',
  description:
    'Data-density launch decision desk. Preflight your landing pages before traffic hits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--app-bg)] text-[var(--app-text)] font-sans">
        <ThemeSkinProvider>
          {children}
        </ThemeSkinProvider>
      </body>
    </html>
  );
}
