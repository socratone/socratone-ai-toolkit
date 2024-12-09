import type { Metadata } from 'next';
import ToastContainer from '@/components/ToastContainer';

import './globals.css';

export const metadata: Metadata = {
  title: 'SocratoneGPT',
  description:
    'SocratoneGPT helps you get answers, find inspiration and be more productive. It is free to use and easy to try. Just ask and SocratoneGPT can help with writing, learning, brainstorming and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard.css"
        />
      </head>
      <body className="antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
