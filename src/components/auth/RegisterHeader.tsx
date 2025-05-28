import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export const RegisterHeader = () => {
  return (
    <div className="relative w-full">
      <div className="relative z-10 pt-6 flex justify-center">
        <Link to="/">
          <Logo />
        </Link>
      </div>
    </div>
  );
};
