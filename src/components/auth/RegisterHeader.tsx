
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';

export const RegisterHeader = () => {
  return (
    <div className="relative w-full">
      <div className="relative z-10 pt-6 flex justify-center">
        <Link to="/">
          <Logo layout="horizontal" size="medium" />
        </Link>
      </div>
    </div>
  );
};
