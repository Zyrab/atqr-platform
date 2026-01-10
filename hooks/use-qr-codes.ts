import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, deleteQrCode } from "@/lib/firebase";

export interface QRCodeData {
  id: string;
  uid: string;
  text: string;
  logoBase64?: string | null;
  createdAt: string;
  color?: string;
}

export function useQRCodes(user: User | null) {
  const [codes, setCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCodes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Using onSnapshot for real-time updates
    const q = query(
      collection(db, "qrcodes"),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedCodes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as QRCodeData[];

        // Sort in memory (Newest first)
        fetchedCodes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setCodes(fetchedCodes);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching codes:", err);
        setError("Failed to load QR codes.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const removeCode = async (id: string) => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      try {
        await deleteQrCode(id);
      } catch (err) {
        alert("Failed to delete code");
      }
    }
  };

  return { codes, loading, error, removeCode };
}