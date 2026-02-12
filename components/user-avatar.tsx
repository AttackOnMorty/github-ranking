'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
  url?: string;
  avatarUrl?: string;
  name?: string;
  size?: 'default' | 'sm' | 'lg';
}

export const UserAvatar = ({
  url,
  avatarUrl,
  name,
  size = 'lg',
}: UserAvatarProps) => {
  const avatarElement = (
    <Avatar size={size}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt="avatar" />
      ) : null}
      <AvatarFallback>
        {name ? name.charAt(0).toUpperCase() : <User className="size-4" />}
      </AvatarFallback>
    </Avatar>
  );

  if (!url) {
    return avatarElement;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer">
      {avatarElement}
    </a>
  );
};
