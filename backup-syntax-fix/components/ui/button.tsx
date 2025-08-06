import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(;
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible: outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disable,
  d:opacity-50',
  {
    variants: {,
  variant: {
        default: 'bg-primary text-primary-foreground hove,
  r:bg-primary/90',
        primary: 'bg-cap-teal text-white hove,
  r:bg-cap-teal/90',
        secondary: 'bg-cap-coral text-white hove,
  r:bg-cap-coral/90',
        destructive: 'bg-destructive text-destructive-foreground hove,
  r:bg-destructive/90',
        outline: 'border border-cap-teal text-cap-teal bg-transparent hover:bg-cap-teal/10 hove,
  r:border-cap-teal',
        ghost: 'hover:bg-accent hove,
  r:text-accent-foreground',
        link: 'text-primary underline-offset-4 hove,
  r:underline',
      },
      size: {,
  default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      rounded: {,
  default: 'rounded-md',
        full: 'rounded-full',
      },
    },
    defaultVariants: {,
  variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(;
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (;
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
