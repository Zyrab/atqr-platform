import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  getDocs, 
  getDoc,
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  limit,
  orderBy
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { QRData } from '@/types/qr';
import { UserData } from '@/types/user-data';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const functions = getFunctions(app, "europe-west3");

export const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Login failed", error);
    throw error;
  }
};

export const logoutUser = () => signOut(auth);

export async function getUserDoc(uid: string): Promise<UserData | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data() as UserData;
}

export const uploadQrLogo = async (uid: string, qrId: string, blob: Blob): Promise<string> => {
  const storageRef = ref(storage, `users/${uid}/qrcodes/${qrId}/logo.png`);
  const snapshot = await uploadBytes(storageRef, blob);
  return await getDownloadURL(snapshot.ref);
};
export const deleteQrLogo = async (uid: string, qrId: string) => {
  try {
    const storageRef = ref(storage, `users/${uid}/qrcodes/${qrId}/logo.png`);
    await deleteObject(storageRef);
  } catch (e: any) {
    if (e.code !== 'storage/object-not-found') console.error("Error deleting logo:", e);
  }
};
export const saveToDashboard = async (uid: string | null, data: QRData, logo: Blob | null) => {
  if (!uid) throw new Error("User not authenticated");

  const newQrRef = doc(collection(db, "users", uid, "qrcodes"));
  const generatedId = newQrRef.id;

  let finalLogoUrl = data.design.logo;

  if (logo) finalLogoUrl = await uploadQrLogo(uid, generatedId, logo);

  const payload = {
    ...data,
    name: data.name || 'qr-code',
    qrId: generatedId,
    design: {
      ...data.design,
      logo: finalLogoUrl
    }
  };

  const createQRCode = httpsCallable(functions, 'createQRCode');

  try {
    const result = await createQRCode(payload); 
    return result.data; 
    
  } catch (error: any) {
    console.error("Error calling createQRCode:", error.code, error.message);
    
    if (error.code === 'resource-exhausted') {
      throw new Error("You've reached your QR code limit. Please upgrade your plan.");
    }
    if (error.code === 'permission-denied') {
      throw new Error(error.message || "You don't have permission to perform this action.");
    }
    
    throw new Error(error.message || "An unexpected error occurred while saving.");
  }
};
export const updateQrCode = async ( uid: string, id: string, data: Partial<QRData>, logo: Blob | null) => {
  try {
    const docRef = doc(db, "users", uid, "qrcodes", id);

    let finalLogoUrl = data.design?.logo;
    if (logo) {
      finalLogoUrl = await uploadQrLogo(uid, id, logo);
    }
    const payload = {
      ...data,
      updatedAt: serverTimestamp(),
      design: {
        ...data.design, 
        logo: finalLogoUrl || null
      }
    };

    await updateDoc(docRef, payload);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};


export const deleteQrCode = async (uid: string, id: string) => {
  try {
    await deleteQrLogo(uid, id);
    await deleteDoc(doc(db, "users", uid, "qrcodes", id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const fetchHistory = async (user: User | null) => {
  if (!user) return [];

  try {
    const q = query(
      collection(db, "users", user.uid, "qrcodes"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
      };
    });
  } catch (e) {
    console.error("Error fetching history: ", e);
    return [];
  }
};

export { app, auth, db, functions, httpsCallable };