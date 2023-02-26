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
    </div>
  );
};

export default Layout;
