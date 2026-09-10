
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * Componente que escuta erros de permissão do Firebase e os lança
 * para que o Next.js os capture no overlay de desenvolvimento.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error) => {
      // Lança o erro para ser capturado pelo Error Boundary do Next.js
      // Isso fornece o contexto visual rico necessário para debugar Security Rules.
      throw error;
    });

    return () => unsubscribe();
  }, []);

  return null;
}
