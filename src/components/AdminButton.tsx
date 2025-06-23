
import React from 'react';
import { Button } from '@/components/ui/button';

type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const AdminButton: React.FC<AdminButtonProps> = ({ children, className, ...props }) => {
  return (
    <Button
      className={`bg-admin hover:bg-admin-hover active:bg-admin-active text-admin-foreground ${className || ''}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AdminButton;
