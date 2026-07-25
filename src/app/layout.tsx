
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AprovaçãoDrive - O Drive Definitivo para o ENEM',
  description: 'Tenha acesso organizado a milhares de materiais em um único lugar para dominar o ENEM.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}
