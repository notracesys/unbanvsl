
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastQueryJson = useRef<string>('');

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    // Evitamos resetar o loading se a query for logicamente a mesma
    // para reduzir cintilação e riscos de loop
    const queryJson = JSON.stringify(query.toString());
    if (queryJson !== lastQueryJson.current) {
      setLoading(true);
      lastQueryJson.current = queryJson;
    }

    let isMounted = true;

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        if (!isMounted) return;
        
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        
        setData(items);
        setLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        console.error("Firestore useCollection error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [query]);

  return { data, loading, error };
}
