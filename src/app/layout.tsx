
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Love Link - Transforme sua história de amor em um presente digital',
  description: 'Crie uma página romântica personalizada para surpreender quem você ama. Com contador de tempo, galeria de fotos e música.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
