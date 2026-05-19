import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config';

export const useFetch = (collectionName, orderByField) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, collectionName);
    const q = orderByField ? query(colRef, orderBy(orderByField, 'desc')) : query(colRef);

    // Menggunakan onSnapshot agar UI otomatis update saat data di database berubah
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error(`useFetch(${collectionName}) error:`, error);
      setLoading(false);
    });

    // Berhenti mendengarkan (cleanup) saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { data, loading };
};
