import { HeartFilled } from '@ant-design/icons';

const Footer: React.FC = () => {
  return (
    <footer className="font-mono pb-6 flex justify-center">
      <span className="text-xs sm:text-sm font-light">
        {/* TODO: Fix icon shift */}
        Crafted with <HeartFilled style={{ color: '#eb2f96' }} /> by{' '}
        <a
          className="text-blue-500 hover:underline no-underline"
          href="https://github.com/AttackOnMorty"
          target="_black"
          rel="noreferrer"
        >
          Luke Mao
        </a>
      </span>
    </footer>
  );
};

export default Footer;
