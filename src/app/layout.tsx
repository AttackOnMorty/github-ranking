import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Analytics } from '@vercel/analytics/next';
import { ConfigProvider } from 'antd';
import { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';

import Footer from '@/components/footer';
import Header from '@/components/header';
import LanguageProvider from '@/context/language-provider';

import '@/app/globals.css';

// https://ant.design/docs/react/v5-for-19
import '@ant-design/v5-patch-for-react-19';

export const firaCode = Fira_Code({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={`${firaCode.className} antialiased`}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'inherit',
              },
            }}
          >
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
          </ConfigProvider>
        </AntdRegistry>
        <Analytics />
      </body>
    </html>
  );
}
