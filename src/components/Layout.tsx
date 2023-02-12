import { GithubOutlined, HeartFilled } from '@ant-design/icons';
import { Button, Layout as AntdLayout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header } = AntdLayout;

interface MenuItem {
  key: string;
  label: string;
  route: string;
  disabled: boolean;
}

const menuItems: MenuItem[] = [
  {
    key: 'Repositories',
    label: 'Repositories',
    route: '/repositories',
    disabled: false,
  },
  {
    key: 'Organizations',
    label: 'Organizations',
    route: '/organizations',
    disabled: true,
  },
  {
    key: 'Users',
    label: 'Users',
    route: '/Users',
    disabled: true,
  },
];

const Layout: React.FC = () => {
  return (
    <AntdLayout className="h-full flex">
      <Header
        className="flex"
        style={{ padding: '0 6rem', background: 'white' }}
      >
        <div className="flex flex-1 items-center">
          <span className="mr-4 text-2xl font-mono cursor-pointer whitespace-nowrap">
            <Link className="text-black hover:text-black" to="/">
              GitHub Ranking
            </Link>
          </span>
          <Menu
            className="flex-1 text-lg"
            mode="horizontal"
            defaultSelectedKeys={['Repositories']}
            items={menuItems.map(({ key, label, route, disabled }) => ({
              key,
              label: disabled ? label : <Link to={route}>{label}</Link>,
              disabled,
            }))}
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
