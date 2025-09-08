import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

interface UserAvatarProps {
  url?: string;
  avatarUrl?: string;
  name?: string;
  size?: number;
}

export const UserAvatar = ({
  url,
  avatarUrl,
  name,
  size = 40,
}: UserAvatarProps) => {
  const avatarElement = (
    <>
      {avatarUrl ? (
        <Avatar src={avatarUrl} size={size} alt="avatar" />
      ) : name ? (
        <Avatar size={size}>{name.charAt(0)}</Avatar>
      ) : (
        <Avatar icon={<UserOutlined />} size={size} />
      )}
    </>
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
