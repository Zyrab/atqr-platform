import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, query, orderBy, limit, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getPaths, getRootPaths } from "./utils";
import { googleProvider, auth, httpsCallable, functions } from "./config";
import type { QRData, QRStat } from '@/types/qr';
import { UserData } from "@/types/user-data";

export const services = {
  auth: {
    loginG: () =>  signInWithPopup(auth, googleProvider),
    login: (e: string, p: string) =>  signInWithEmailAndPassword(auth, e, p),
    register: (e: string, p: string) =>  createUserWithEmailAndPassword(auth, e, p),
    logout: () => signOut(auth),
    getUserData: async (uid: string) =>  {
      const snap = await getDoc(getPaths(uid).userDoc);
      return snap.exists() ? snap.data() as UserData : null;
    },
  },
  storage: {
    uploadLogo: async (uid: string, qrId: string, blob: Blob) => {
      const sRef = getPaths(uid).storageLogo(qrId);
      const snap = await uploadBytes(sRef, blob);
      return getDownloadURL(snap.ref);
    },
    deleteLogo: async (uid: string, qrId: string) => await deleteObject(getPaths(uid).storageLogo(qrId)),
  },
  qr: {
    fetch: async (uid: string) => {
      const q = query(getPaths(uid).qrCol, orderBy("createdAt", "desc"), limit(20));
      const snap = await getDocs(q);
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
          updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
        };
      });
    },
    fetchStat:async (slug:string) => {
      const snap = await getDoc(getRootPaths.qrStat(slug));
      return snap.exists() ? snap.data() as QRStat : null;
    },
    save: async (uid: string, data: QRData, logoBlob: Blob | null) => {
      const newRef = doc(getPaths(uid).qrCol);
      let logoUrl = data.design?.logo;
      if (logoBlob) logoUrl = await services.storage.uploadLogo(uid, newRef.id, logoBlob);
      
      const call = httpsCallable(functions, 'createQRCode');
      return (await call({ ...data, qrId: newRef.id, design: { ...data.design, logo: logoUrl } })).data;
    },
    update: async (uid: string, id: string, data: Partial<QRData>, logoBlob: Blob | null) => {
      let logoUrl = data.design?.logo;
      if (logoBlob) logoUrl = await services.storage.uploadLogo(uid, id, logoBlob);
      
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
        design: { ...data.design, logo: logoUrl || null }
      };
      await updateDoc(getPaths(uid).qrDoc(id), payload);
    },
    delete: async (uid: string, id: string) => {
      await services.storage.deleteLogo(uid, id).catch(() => {});
      await deleteDoc(getPaths(uid).qrDoc(id));
    }
  },
  stripe: {
     startTrial: async () => {
      const res = await httpsCallable(functions, "handleTrialStart")({});
      return res.data as { success: boolean; trialEndsAt: string; plan: "trial" };
    },
    portal: async () => {
      const res = await httpsCallable(functions, "getCustomerPortalLink")({});
      const data = res.data as { url?: string };
      if (data.url) window.location.href = data.url;
    },
    checkout: async () => {
      const res = await httpsCallable(functions, "createCheckoutSession")({});
      const data = res.data as { url?: string };
      if (data.url) window.location.href = data.url;
    }
  }
};