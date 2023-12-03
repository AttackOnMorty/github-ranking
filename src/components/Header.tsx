import { GithubOutlined } from '@ant-design/icons';
import { Button, Menu, Tooltip } from 'antd';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import GitHubTrends from '../assets/github-trends.png';
import Logo from '../assets/logo.png';

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
  {
    key: '/organizations',
    label: <Link to={'/organizations'}>Organizations</Link>,
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
    <header className="px-6 py-6 sm:py-0 sm:px-14 flex items-center">
      <div className="flex flex-1 items-center">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="w-10 h-10 mr-4" />
          <span className="mr-4 text-2xl font-mono cursor-pointer whitespace-nowrap">
            <Link
              className="text-black hover:text-black no-underline"
              to="/"
              onClick={handleTitleClick}
            >
              GitHub Ranking
            </Link>
          </span>
        </div>
        <Menu
          className="hidden sm:block sm:text-lg flex-1"
          style={{ lineHeight: '4.5rem' }}
          mode="horizontal"
          selectedKeys={[current]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </div>
      <a
        className="hidden lg:block"
        href="https://www.github-trends.com/"
        target="_black"
        rel="noreferrer"
      >
        <Tooltip title="Compare repos via GitHub Trends">
          <Button type="text">
            <img src={GitHubTrends} style={{ width: 20, height: 20 }} />
          </Button>
        </Tooltip>
      </a>
      <a
        className="hidden lg:block"
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
