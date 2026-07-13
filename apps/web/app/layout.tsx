import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HYBRID Home Assistant — Genesis',
  description: 'AI-native smart home platform by HYBRID.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
