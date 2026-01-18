"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context"; // Assumes you have this from your auth setup
import { fetchHistory, deleteQrCode as firebaseDelete, updateQrCode as firebaseUpdate } from "@/lib/firebase";

// Define the shape of a QR Code object (matching your Firestore structure)
export interface QRCodeItem {
  id: string;
  uid: string;
  name: string;
  type: "url" | "wifi" | "vcard" | "text";
  content: {
    url?: string;
    text?: string;
    // add others as needed
  };
  design: {
    color: string;
    bgColor: string;
    style: string;
    logoStyle: string;
    eyeFrame: string;
    eyeBall: string;
    logo: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface QRContextType {
  qrCodes: QRCodeItem[];
  loading: boolean;
  error: string | null;
  refreshQRCodes: () => Promise<void>;
  deleteQr: (id: string) => Promise<void>;
  updateQr: (id: string, data: Partial<QRCodeItem>) => Promise<void>;
  getQrById: (id: string) => QRCodeItem | undefined;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Logic
  const loadData = useCallback(async () => {
    if (!user) {
      setQrCodes([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory(user);
      // Ensure the data matches our type. fetchHistory returns `any[]` usually,
      // so we cast it or you can add stricter typing in firebase.ts
      setQrCodes(data as QRCodeItem[]);
    } catch (err: any) {
      console.error("Failed to load QR codes", err);
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Automatically load data when user logs in
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Delete Logic
  const deleteQr = async (id: string) => {
    // Optimistic update: Remove from UI immediately
    const previousCodes = [...qrCodes];
    setQrCodes((prev) => prev.filter((item) => item.id !== id));

    try {
      await firebaseDelete(id);
    } catch (err) {
      // Revert on failure
      console.error("Delete failed", err);
      setQrCodes(previousCodes);
      throw err;
    }
  };

  // 3. Update Logic
  const updateQr = async (id: string, updates: Partial<QRCodeItem>) => {
    // Optimistic update
    setQrCodes((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    try {
      await firebaseUpdate(id, updates);
    } catch (err) {
      console.error("Update failed", err);
      // We might want to trigger a refresh here if strict consistency is needed,
      // or revert if you implement a history stack.
      // For now, reloading from server to ensure sync is safest on error.
      loadData();
      throw err;
    }
  };

  // 4. Helper to find a single QR (useful for the Generator/Edit page)
  const getQrById = (id: string) => {
    return qrCodes.find((item) => item.id === id);
  };

  return (
    <QRContext.Provider
      value={{
        qrCodes,
        loading,
        error,
        refreshQRCodes: loadData,
        deleteQr,
        updateQr,
        getQrById,
      }}
    >
      {children}
    </QRContext.Provider>
  );
}

// Custom Hook
export function useQR() {
  const context = useContext(QRContext);
  if (context === undefined) {
    throw new Error("useQR must be used within a QRProvider");
  }
  return context;
}
