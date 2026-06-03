import React from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

// Component to handle reactive translations within the toast
const TranslatedMessage = ({ message, values, suffix }) => {
  const { t } = useTranslation();
  // If it's a string, try to translate it. i18next returns the key if not found.
  if (typeof message === 'string') {
    return <>{t(message, values)}{suffix}</>;
  }
  return <>{message}</>;
};

// Export a wrapped toast object that automatically uses TranslatedMessage
export const toast = {
  success: (message, options) => 
    sonnerToast.success(<TranslatedMessage message={message} values={options?.values} suffix={options?.suffix} />, options),
  error: (message, options) => 
    sonnerToast.error(<TranslatedMessage message={message} values={options?.values} suffix={options?.suffix} />, options),
  info: (message, options) => 
    sonnerToast.info(<TranslatedMessage message={message} values={options?.values} suffix={options?.suffix} />, options),
  warning: (message, options) => 
    sonnerToast.warning(<TranslatedMessage message={message} values={options?.values} suffix={options?.suffix} />, options),
  loading: (message, options) => 
    sonnerToast.loading(<TranslatedMessage message={message} values={options?.values} suffix={options?.suffix} />, options),
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
};

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
      }}
    />
  );
};

export default Toaster;
