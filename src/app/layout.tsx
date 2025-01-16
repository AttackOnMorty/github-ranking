import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Footer from '@/components/footer';
import Header from '@/components/header';
import LanguageProvider from '@/context/language-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Github Ranking',
  description: 'GitHub ranking for repositories, users, and organizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <LanguageProvider>
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
          </LanguageProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
