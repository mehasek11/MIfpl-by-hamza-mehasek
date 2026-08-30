import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'MIfpl by hamza mehasek',
  description: 'AI Transfer Desk & Matchday Hub',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-stone-100 text-stone-900 antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
} 
