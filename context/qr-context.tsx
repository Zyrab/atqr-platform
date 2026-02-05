"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { fetchHistory, deleteQrCode as deleteQrCode, updateQrCode, saveToDashboard } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import { QRDocument, QRData } from "@/types/qr";

interface QRContextType {
  qrCodes: QRDocument[];
  loading: boolean;
  error: string | null;
  refreshQRCodes: () => Promise<void>;
  deleteQr: (id: string) => Promise<void>;
  updateQr: (id: string, data: Partial<QRData>) => Promise<void>;
  saveQr: (data: QRData) => Promise<void>;
  getQrById: (id: string) => QRData | undefined;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  const [qrCodes, setQrCodes] = useState<QRDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) {
      setQrCodes([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory(user);
      setQrCodes(data as QRDocument[]);
    } catch (err: any) {
      console.error("Failed to load QR codes", err);
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deleteQr = async (id: string) => {
    const previousCodes = [...qrCodes];
    setQrCodes((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteQrCode(id);
    } catch (err) {
      console.error("Delete failed", err);
      setQrCodes(previousCodes);
      throw err;
    }
  };

  const updateQr = async (id: string, updates: Partial<QRData>) => {
    setQrCodes((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    try {
      await updateQrCode(id, updates);
      router.push("/dashboard");
    } catch (err) {
      console.error("Update failed", err);
      loadData();
      throw err;
    }
  };

  const saveQr = async (qrData: QRData) => {
    if (!user) {
      router.push("/auth?mode=login");
      return;
    }

    setLoading(true);
    try {
      await saveToDashboard(user, qrData);
      loadData();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving. If you used a custom logo, it might be too large.");
    } finally {
      setLoading(false);
    }
  };
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
        saveQr,
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
