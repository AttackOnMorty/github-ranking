'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Geist, Geist_Mono } from 'next/font/google';
import { createContext, useEffect, useState } from 'react';

import { getLanguagesAsync } from '@/api';
import Footer from '@/components/footer';
import Header from '@/components/header';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// TODO: set metadata
// export const metadata: Metadata = {
//   title: 'Github Ranking',
//   description: 'GitHub ranking for repositories, users, and organizations.',
// };

// TODO: Should I put context in layout?
export const LanguagesContext = createContext<string[]>([]);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [languages, setLanguages] = useState<string[]>([]);

  // TODO: why clearTimeout?
  useEffect(() => {
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    const id = setTimeout(() => {
      void getLanguages();
    }, 300);
    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguagesContext.Provider value={languages}>
          <AntdRegistry>
            <div className="h-full flex flex-col">
              <Header />
              <div className="flex flex-1 flex-col bg-[#f5f5f5]">
                <main className="flex flex-1 justify-center">
                  <div className="max-w-6xl px-6 py-6 flex flex-1">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
            </div>
          </AntdRegistry>
        </LanguagesContext.Provider>
      </body>
    </html>
  );
}
