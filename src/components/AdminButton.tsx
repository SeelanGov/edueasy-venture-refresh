
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AdminButton: React.FC<AdminButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary',
  size = 'default',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('font-semibold', className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export { AdminButton };
export default AdminButton;
