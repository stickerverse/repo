
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';

interface GradientBorderButtonProps extends ButtonProps {
  gradientColor?: string;
  containerClassName?: string;
}

const GradientBorderButton = React.forwardRef<
  HTMLButtonElement,
  GradientBorderButtonProps
>(
  (
    {
      children,
      className,
      containerClassName,
      gradientColor = 'from-accent via-primary/50 to-accent',
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('p-px rounded-lg', containerClassName, `bg-gradient-to-r ${gradientColor}`)}>
        <Button
          ref={ref}
          className={cn(
            'w-full h-full bg-background text-foreground hover:bg-background/90',
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }
);

GradientBorderButton.displayName = 'GradientBorderButton';

export { GradientBorderButton };
