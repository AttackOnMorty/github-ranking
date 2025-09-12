import { HeartFilled } from '@ant-design/icons';

const PROFILE_URL = 'https://www.linkedin.com/in/luke-mao';

const Footer: React.FC = () => {
  return (
    <footer className="pb-6 flex justify-center">
      <span className="text-xs sm:text-sm font-light text-black">
        Crafted with <HeartFilled style={{ color: '#eb2f96' }} /> by{' '}
        <a
          className="custom-link"
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
