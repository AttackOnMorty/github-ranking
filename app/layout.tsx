import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import Header from '@/components/header';
import LanguageProvider from '@/context/language-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'GitHub Ranking',
  description: 'Top GitHub repositories, users and organizations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-sans antialiased">
        <TooltipProvider>
          <LanguageProvider>
            <div className="h-full flex flex-col min-h-screen mx-auto">
              <div className="max-w-6xl w-full mx-auto">
                <Header />
              </div>
              <div className="flex flex-1 flex-col">
                <main className="flex flex-1 justify-center">
                  <div className="max-w-6xl w-full py-4 flex flex-1">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </LanguageProvider>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
