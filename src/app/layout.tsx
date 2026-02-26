import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MiPOS — Sistema de Punto de Venta',
  description:
    'Sistema profesional de Punto de Venta y Gestión de Inventario para tu negocio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen lg:pl-0">
          <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
