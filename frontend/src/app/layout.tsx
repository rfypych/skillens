import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

// Theme token chain (theme.css) reads --font-mono-source; expose the same
// JetBrains Mono face under that variable name (landing keeps Helvetica).
const jetbrainsMonoSource = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-source',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Skillens',
  description: 'AI-powered technical assessment and recruitment platform.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${jetbrainsMonoSource.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased bg-background-full text-text-primary" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
