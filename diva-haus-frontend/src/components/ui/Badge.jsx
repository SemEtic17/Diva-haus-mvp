import React from 'react';

const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'border-transparent bg-gold text-black hover:bg-gold/80',
    secondary: 'border-transparent bg-white/10 text-white hover:bg-white/20',
    destructive: 'border-transparent bg-red-500 text-white hover:bg-red-500/80',
    outline: 'text-gold border border-gold/50',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className || ''}`}
      {...props}
    />
  );
};

export { Badge };
