import React from 'react';

export const metadata = {
  title: 'Noteee - AI-Powered Offline-First Notebook',
  description: 'Capture-first, AI-powered offline-first cross-platform notebook app.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0F172A', color: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
