import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  setDoc,
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

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
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

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

export async function createUserDoc(user: User): Promise<UserData> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const data: UserData = {
      email: user.email,
      plan: "free",
      qrLimit: 10,
      subscriptionStatus: "inactive",
      stripeCustomerId: null,
      paidUntil: null,
      createdAt: serverTimestamp() as any,
    };

    await setDoc(ref, data);
    return data;
  }

  return snap.data() as UserData;
}

export const saveToDashboard = async (user: User | null, data: QRData) => {
  if (!user) throw new Error("User not authenticated");

  if (data.design.logo && data.design.logo.length > 800000) {
    throw new Error("Logo image is too large for database storage. Please resize below 500KB.");
  }

  try {
    await addDoc(collection(db, "qrcodes"), {
      uid: user.uid,
      name: data.name || "Untitled QR",
      content: data.content,
      design: data.design,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const updateQrCode = async (id: string, data: Partial<QRData>) => {
  try {
    const docRef = doc(db, "qrcodes", id);
    const payload = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, payload);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteQrCode = async (id: string) => {
  try {
    await deleteDoc(doc(db, "qrcodes", id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const fetchHistory = async (user: User | null) => {
  if (!user) return [];
  try {
    const q = query(collection(db, "qrcodes"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    
    // Convert Firestore Timestamps back to simple Strings for the UI
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });
  } catch (e) {
    console.error("Error fetching history: ", e);
    return [];
  }
};

export { app, auth, db };