import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface JobAlert {
  id?: string;
  userId: string;
  keywords: string;
  location: string;
  remoteOnly: boolean;
  minSalary: string;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  createdAt?: any;
}

export async function getUserJobAlerts(userId: string): Promise<JobAlert[]> {
  const q = query(collection(db, 'job_alerts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobAlert));
}

export async function createJobAlert(alert: Omit<JobAlert, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'job_alerts'), {
    ...alert,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateJobAlert(id: string, updates: Partial<JobAlert>) {
  const docRef = doc(db, 'job_alerts', id);
  await updateDoc(docRef, updates);
}

export async function deleteJobAlert(id: string) {
  const docRef = doc(db, 'job_alerts', id);
  await deleteDoc(docRef);
}
