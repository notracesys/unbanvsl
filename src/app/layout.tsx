
'use client';

import './globals.css';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, firestore, auth } = initializeFirebase();

  return (
    <html lang="pt-BR">
      <body>
        <FirebaseProvider app={app} firestore={firestore} auth={auth}>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
