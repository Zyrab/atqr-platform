import { collection, doc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { db, storage } from "./config";

export const getPaths = (uid: string) => ({
  userDoc: doc(db, 'users', uid),
  qrCol: collection(db, 'users', uid, 'qrcodes'),
  qrDoc: (id: string) => doc(db, 'users', uid, 'qrcodes', id),
  storageLogo: (id: string) => ref(storage, `users/${uid}/qrcodes/${id}/logo.png`)
});