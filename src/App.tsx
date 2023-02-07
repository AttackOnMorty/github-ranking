import { GithubOutlined, HeartFilled } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="h-full flex">
      <Header className="flex" style={{ background: 'white' }}>
        <div className="flex flex-1 items-center">
          <span className="mr-4 text-2xl font-semibold font-mono cursor-pointer">
            GitHub Ranking
          </span>
          <Menu
            className="flex-1 text-lg"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={['Repositories', 'Organizations', 'Users'].map(
              (label, index) => ({
                key: index,
                label,
              })
            )}
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
      <Content
        className="flex flex-1 flex-col"
        style={{ padding: '0 50px', background: 'white' }}
      >
        <div className="mt-4 flex-1">Content</div>
      </Content>
      <Footer
        className="flex justify-center"
        style={{ padding: '16px 0', background: 'white' }}
      >
        <span className="text-sm">
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
      </Footer>
    </Layout>
  );
};

export default App;
