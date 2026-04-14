import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

// Export toast directly for easy use in other components
export { toast };

const Toaster = () => {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="bottom-center"
      theme={theme}
      toastOptions={{
        // Define default options
        duration: 3000,
        className: 'rounded-2xl border-glass-border/30 backdrop-blur-xl font-sans',
        style: {
          background: theme === 'dark' ? 'hsl(222 47% 8% / 0.9)' : 'hsl(0 0% 100% / 0.9)',
          color: theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222 47% 12%)',
          border: '1px solid hsl(var(--glass-border) / 0.1)',
        },

        // Default options for specific types
        success: {
          iconTheme: {
            primary: 'hsl(var(--gold))',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
      }}
    />
  );
};

export default Toaster;
