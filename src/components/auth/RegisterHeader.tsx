import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';


/**
 * RegisterHeader
 * @description Function
 */
export const RegisterHeader = (): void => {
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
