import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      'body-lg': 'text-lg leading-7',
      body: 'text-base leading-7',
      'body-sm': 'text-sm leading-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      'inline-code':
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      caption: 'text-xs text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = as || getDefaultTag(variant) || 'p';
    return React.createElement(Comp, {
      className: cn(typographyVariants({ variant, className })),
      ref,
      ...props,
    });
  },
);
Typography.displayName = 'Typography';

function getDefaultTag(variant: TypographyProps['variant']) {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'blockquote':
      return 'blockquote';
    case 'inline-code':
      return 'code';
    case 'caption':
      return 'span';
    case 'body':
    case 'body-lg':
    case 'body-sm':
      return 'p';
    default:
      return 'p';
  }
}

export { Typography, typographyVariants };
