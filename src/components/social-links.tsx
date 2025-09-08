import { LinkOutlined, XOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { ReactElement } from 'react';

import { EMPTY } from '@/constants';

interface SocialLinksProps {
  blog?: string | null;
  twitter?: string | null;
}

interface SocialLink {
  url: string;
  icon: ReactElement;
}

export const SocialLinks = ({ blog, twitter }: SocialLinksProps) => {
  const links: SocialLink[] = [];

  if (blog) {
    links.push({
      url: blog,
      icon: <LinkOutlined />,
    });
  }

  if (twitter) {
    links.push({
      url: `https://x.com/${twitter}`,
      icon: <XOutlined />,
    });
  }

  if (links.length === 0) {
    return <>{EMPTY}</>;
  }

  return (
    <Space>
      {links.map((link, index) => (
        <a
          key={index}
          className="text-black"
          href={link.url}
          target="_blank"
          rel="noreferrer"
        >
          {link.icon}
        </a>
      ))}
    </Space>
  );
};
