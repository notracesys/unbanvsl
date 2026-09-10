
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    // Inicialização segura e única (Singleton)
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

export { FirebaseProvider, useFirebase, useFirestore, useAuth, useFirebaseApp } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
