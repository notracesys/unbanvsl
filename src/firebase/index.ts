
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    if (!firestore) firestore = getFirestore(app);
    if (!auth) auth = getAuth(app);
  }
  return { app, firestore, auth };
}

/**
 * Hook para estabilizar referências do Firebase (queries, docs, refs).
 * Essencial para evitar loops de renderização (Maximum update depth).
 */
export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  const [ref, setRef] = useState<T>(factory);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const depsChanged = deps.length !== prevDeps.current.length || 
                       deps.some((dep, i) => dep !== prevDeps.current[i]);
    
    if (depsChanged) {
      prevDeps.current = deps;
      setRef(factory());
    }
  }, deps);

  return ref;
}

export { FirebaseProvider, useFirebase, useFirestore, useAuth, useFirebaseApp } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
