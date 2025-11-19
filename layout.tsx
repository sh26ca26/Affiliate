import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

// Load fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const cairo = localFont({
  src: [
    {
      path: '../fonts/cairo/Cairo-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/cairo/Cairo-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Affiliate SaaS - نظام التسويق بالعمولة',
  description: 'منصة متكاملة لإدارة برامج التسويق بالعمولة والإحالات',
  keywords: ['affiliate', 'marketing', 'commission', 'referral', 'saas'],
  authors: [{ name: 'Affiliate SaaS Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://affiliatesaas.com',
    siteName: 'Affiliate SaaS',
    title: 'Affiliate SaaS - نظام التسويق بالعمولة',
    description: 'منصة متكاملة لإدارة برامج التسويق بالعمولة والإحالات',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${cairo.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#14b8a6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-cairo">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

