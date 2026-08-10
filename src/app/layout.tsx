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

export const metadata: Metadata = {
  title: 'Rifa Egresados 2026',
  description: 'Consulta en tiempo real la grilla de números y estado de ventas de la Rifa de Egresados.',
  icons: {
    icon:'/icon.svg'
  }
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
