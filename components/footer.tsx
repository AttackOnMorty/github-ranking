import { Heart } from 'lucide-react';

const PROFILE_URL = 'https://www.linkedin.com/in/luke-mao';

const Footer: React.FC = () => {
  return (
    <footer className="pb-6 flex justify-center">
      <span className="text-xs sm:text-sm font-light">
        Crafted with{' '}
        <Heart
          className="inline size-3 fill-pink-500 text-pink-500"
        />{' '}
        by{' '}
        <a
          className="underline hover:no-underline"
          href={PROFILE_URL}
          target="_blank"
          rel="noreferrer"
        >
          Luke Mao
        </a>
      </span>
    </footer>
  );
};

export default Footer;
