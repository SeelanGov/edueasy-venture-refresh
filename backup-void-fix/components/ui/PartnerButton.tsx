import { Button } from '@/components/ui/button';
import React from 'react';

interface PartnerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * PartnerButton
 * @description Function
 */
export const PartnerButton: React.FC<PartnerButtonProps> = ({
  children,
  className = '',
  ...props
}) => (
  <Button
    className={`bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-lg px-5 py-2 shadow-soft transition-colors duration-150 ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export default PartnerButton;
