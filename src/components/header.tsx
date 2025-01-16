'use client';

import { GithubOutlined } from '@ant-design/icons';
import { Button, Menu, Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import type { MenuProps } from 'antd';

const menuItems = [
  {
    key: '/repositories',
    label: (
      <Link href="/repositories" className="text-base">
        Repositories
      </Link>
    ),
  },
  {
    key: '/users',
    label: (
      <Link href="/users" className="text-base">
        Users
      </Link>
    ),
  },
  {
    key: '/organizations',
    label: (
      <Link href="/organizations" className="text-base">
        Organizations
      </Link>
    ),
  },
];

const Header: React.FC = () => {
  const pathname = usePathname();

  const [current, setCurrent] = useState(
    pathname === '/' ? '/repositories' : pathname
  );

  const handleTitleClick = (): void => {
    setCurrent('/repositories');
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <header className="px-6 py-6 sm:py-0 sm:px-14 flex items-center">
      <div className="flex flex-1 items-center space-x-10">
        <div className="flex items-center">
          <Image
            className="mr-4"
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
          />
          <Link className="text-xl" href="/" onClick={handleTitleClick}>
            GitHub Ranking
          </Link>
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
        href="https://www.github-trends.dev/"
        target="_black"
        rel="noreferrer"
      >
        <Tooltip title="Compare repositories via GitHub Trends">
          <Button type="text">
            <Image
              src="/github-trends.png"
              width={20}
              height={20}
              alt="GitHub Trends"
            />
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
