import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


const DOMAIN = 'https://rifa-grilli2026.vercel.app/';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: 'Rifa Egresados 2026 - Instituto Grilli',
  description: 'Consulta en tiempo real la grilla de números de la Rifa de Egresados del Instituto Grilli.',
  openGraph: {
    title: 'Rifa Egresados 2026 - Instituto Grilli',
    description: 'Consulta la grilla de números disponibles en tiempo real.',
    url: DOMAIN,
    siteName: 'Rifa Egresados 2026',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: 'https://rifa-grilli2026.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rifa Egresados 2026 - Instituto Grilli',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rifa Egresados 2026 - Instituto Grilli',
    description: 'Consulta la grilla de números disponibles en tiempo real.',
    images: ['/og-image.png'],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#2C1810] font-sans selection:bg-[#800020] selection:text-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
