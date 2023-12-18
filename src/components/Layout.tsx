import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col bg-[#f5f5f5]">
        <main className="flex flex-1 justify-center">
          <div className="max-w-6xl px-6 py-6 flex flex-1">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default Layout;
