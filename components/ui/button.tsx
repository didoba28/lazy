import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'bg-brand text-white shadow-[0_4px_18px_-4px_rgba(15,42,71,0.45)] hover:bg-brand-accent hover:shadow-[0_6px_22px_-4px_rgba(15,42,71,0.5)]',
        outline:
          'border border-brand/20 bg-white text-brand hover:bg-mist hover:border-brand/30',
        ghost: 'text-brand hover:bg-mist',
        gold: 'bg-brand-gold text-brand shadow-[0_4px_16px_-4px_rgba(201,169,97,0.4)] hover:brightness-95',
        whatsapp: 'bg-whatsapp text-white shadow-[0_4px_16px_-4px_rgba(37,211,102,0.4)] hover:brightness-95',
        link: 'text-brand-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-base sm:text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
