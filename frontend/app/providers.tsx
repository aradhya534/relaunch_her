'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#3D2880',
            color: '#F0EBF8',
            borderRadius: '12px',
            border: '1px solid #00C9B1',
          },
          success: {
            iconTheme: {
              primary: '#00C9B1',
              secondary: '#1A0F3D',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
