import { GithubOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { MenuProps } from 'antd';

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

const Header: React.FC = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(
    location.pathname === '/' ? '/repositories' : location.pathname
  );

  const handleTitleClick = (): void => {
    setCurrent('/repositories');
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <header className="px-6 sm:px-14 flex items-center">
      <div className="flex flex-1 items-center">
        <span className="mr-4 text-lg sm:text-2xl font-mono cursor-pointer whitespace-nowrap">
          <Link
            className="text-black hover:text-black no-underline"
            to="/"
            onClick={handleTitleClick}
          >
            GitHub Ranking
          </Link>
        </span>
        <Menu
          className="flex-1 sm:text-lg"
          style={{ lineHeight: '4rem' }}
          mode="horizontal"
          selectedKeys={[current]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </div>
      <a
        className="hidden sm:block"
        href="https://github.com/AttackOnMorty/github-ranking"
        target="_black"
        rel="noreferrer"
      >
        <Button type="text">
          <GithubOutlined className="text-xl" />
        </Button>
      </a>
    </header>
  );
};

export default Header;
