import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const getStoragePathFromUrl = (downloadUrl) => {
  if (!downloadUrl) return '';
  try {
    const parsedUrl = new URL(downloadUrl);
    const match = parsedUrl.pathname.match(/\/o\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : downloadUrl;
  } catch (error) {
    console.warn('Failed to parse storage URL:', error);
    return downloadUrl;
  }
};

const useFirebaseDeletion = (collectionName) => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (id, storageUrl, confirmationMessage = 'Apakah Anda yakin ingin menghapus item ini?') => {
    if (!window.confirm(confirmationMessage)) return false;
    setLoading(true);

    try {
      if (storageUrl) {
        const storagePath = getStoragePathFromUrl(storageUrl);
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      }

      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error('Firebase deletion error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading };
};

export default useFirebaseDeletion;
