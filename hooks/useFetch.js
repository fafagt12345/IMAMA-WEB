import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFetch = (collectionName, orderByField) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, collectionName);
        const q = orderByField ? query(colRef, orderBy(orderByField, 'desc')) : query(colRef);
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(items);
      } catch (error) {
        console.error(`useFetch(${collectionName}) error:`, error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, orderByField]);

  return { data, loading };
};
