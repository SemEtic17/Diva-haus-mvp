import React from 'react';

const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-glass-border/30 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
};

export { Textarea };
