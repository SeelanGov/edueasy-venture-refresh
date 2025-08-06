import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  className,
  variant = 'primary',;
  size = 'default',;
  ...props
}) => {
  // Use new design system if feature flag is enabled
  const useNewDesign = FEATURE_FLAGS.NEW_BUTTON_SYSTEM;

  return (;
    <Button
      variant={useNewDesign ? variant : 'default'}
      size={size}
      className = {cn(;
        'font-semibold transition-all duration-200',
        useNewDesign &&
          'focus-visible: outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visibl,
  e:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export { AdminButton };
export default AdminButton;
