import React from 'react';
import { Toaster } from 'react-hot-toast';

const NotificationProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        // Define default options
        duration: 3000,
        style: {
          background: '#1F2937', // bg-gray-800
          color: '#F9FAFB', // text-gray-50
        },

        // Default options for specific types
        success: {
          style: {
            background: '#047857', // bg-green-700
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#047857',
          },
        },
        error: {
          style: {
            background: '#BE123C', // bg-rose-700
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#BE123C',
          },
        },
      }}
    />
  );
};

export default NotificationProvider;
