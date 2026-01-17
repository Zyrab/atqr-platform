import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

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

// --- History & Saving Logic ---

// Updated to accept an 'options' object for styles
export const saveQrToHistory = async (user: User | null, text: string, logoBase64: string | null = null, options: any = {}) => {
  if (!user) return;
  try {
    await addDoc(collection(db, "qrcodes"), {
      uid: user.uid,
      text: text,
      logoBase64: logoBase64,
      ...options, // Spread style options (color, style, logoStyle)
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// NEW: Update an existing QR code
export const updateQrCode = async (id: string, data: any) => {
  try {
    const docRef = doc(db, "qrcodes", id);
    // Remove undefined fields
    const cleanData = JSON.parse(JSON.stringify(data));
    await updateDoc(docRef, cleanData);
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
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching history: ", e);
    return [];
  }
};

export { app, auth, db };