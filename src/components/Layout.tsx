import { GithubOutlined, HeartFilled } from '@ant-design/icons';
import { Button, Layout as AntdLayout, Menu } from 'antd';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import type { MenuProps } from 'antd';

const { Header } = AntdLayout;

const menuItems = [
  {
    key: '/repositories',
    label: <Link to={'/repositories'}>Repositories</Link>,
  },
  {
    key: '/users',
    label: <Link to={'/users'}>Users</Link>,
  },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(
    location.pathname === '/' ? '/repositories' : location.pathname
  );

  const handleClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <AntdLayout className="h-full flex">
      <Header
        className="flex"
        style={{ padding: '0 6rem', background: 'white' }}
      >
        <div className="flex flex-1 items-center">
          <span className="mr-4 text-xl font-mono cursor-pointer whitespace-nowrap">
            <Link className="text-black hover:text-black" to="/">
              GitHub Ranking
            </Link>
          </span>
          <Menu
            className="flex-1 text-lg"
            mode="horizontal"
            selectedKeys={[current]}
            onClick={handleClick}
            items={menuItems}
          />
        </div>
        <a
          href="https://github.com/AttackOnMorty/github-ranking"
          target="_black"
          rel="noreferrer"
        >
          <Button type="text">
            <GithubOutlined className="text-xl" />
          </Button>
        </a>
      </Header>
      <main className="flex flex-1 justify-center bg-[#f5f5f5]">
        <div className="max-w-6xl px-14 py-6 flex">
          <Outlet />
        </div>
      </main>
      <footer className="pb-6 flex justify-center bg-[#f5f5f5]">
        <span className="text-sm font-light">
          Crafted with <HeartFilled style={{ color: '#eb2f96' }} /> by{' '}
          <a
            className="text-blue-500 hover:underline"
            href="https://github.com/AttackOnMorty"
            target="_black"
            rel="noreferrer"
          >
            Luke Mao
          </a>
        </span>
      </footer>
    </AntdLayout>
  );
};

export default Layout;
