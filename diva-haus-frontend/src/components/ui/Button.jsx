import React from 'react';

const Button = ({ className, variant = 'default', size = 'default', asChild = false, ...props }) => {
  const Comp = 'button';
  const variants = {
    default: 'bg-gold text-black hover:bg-gold/90',
    destructive: 'bg-red-500 text-white hover:bg-red-500/90',
    outline: 'border border-gold/50 bg-transparent hover:bg-gold/10 text-gold',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    ghost: 'hover:bg-white/10 text-foreground',
    link: 'text-gold underline-offset-4 hover:underline',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    />
  );
};

export { Button };
