'use client';

import { Github, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRepositoryInfo } from '@/hooks/use-github-api';
import { formatNumber } from '@/utils';

const REPO_OWNER = 'AttackOnMorty';
const REPO_NAME = 'github-ranking';
const GITHUB_RANKING_REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
const GITHUB_TRENDS_URL =
  'https://github-trends-attackonmortys-projects.vercel.app';

const navItems = [
  { href: '/repositories', label: 'Repositories' },
  { href: '/users', label: 'Users' },
  { href: '/organizations', label: 'Organizations' },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname === '/' ? '/repositories' : pathname;

  const { data: repoInfo } = useRepositoryInfo(REPO_OWNER, REPO_NAME);

  return (
    <header className="py-4 flex items-center border-b bg-background">
      <div className="flex flex-1 items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" width={32} height={32} alt="logo" />
          <span className="text-lg font-semibold">GitHub Ranking</span>
        </Link>
        <Tabs
          value={currentPath}
          onValueChange={(value) => router.push(value)}
          className="hidden sm:flex"
        >
          <TabsList variant="line">
            {navItems.map((item) => (
              <TabsTrigger className='text-sm' key={item.href} value={item.href}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="hidden lg:flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <a
                href={GITHUB_TRENDS_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/github-trends.png"
                  width={20}
                  height={20}
                  alt="GitHub Trends"
                />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Compare repositories via GitHub Trends</TooltipContent>
        </Tooltip>
        <Button variant="ghost" asChild>
          <a
            href={GITHUB_RANKING_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            <Github className="size-5" />
            {repoInfo?.stars && (
              <span className="flex items-center gap-1 text-sm">
                <Star className="size-3 fill-current" />
                <span>{formatNumber(repoInfo.stars)}</span>
              </span>
            )}
          </a>
        </Button>
      </div>
    </header>
  );
};

export default Header;
