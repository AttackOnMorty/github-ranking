import { EMPTY } from '@/constants';
import { Link } from 'lucide-react';

interface SocialLinksProps {
  blog?: string | null;
  twitter?: string | null;
}

interface SocialLink {
  url: string;
  icon: React.ReactNode;
  label: string;
}

export const SocialLinks = ({ blog, twitter }: SocialLinksProps) => {
  const links: SocialLink[] = [];

  if (blog) {
    links.push({
      url: blog,
      icon: <Link className="size-4" />,
      label: 'Blog',
    });
  }

  if (twitter) {
    links.push({
      url: `https://x.com/${twitter}`,
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: 'Twitter',
    });
  }

  if (links.length === 0) {
    return <>{EMPTY}</>;
  }

  return (
    <div className="flex items-center gap-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};
