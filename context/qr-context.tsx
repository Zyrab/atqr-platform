"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useSafeAction } from "@/hooks/use-safe-action";
import { services } from "@/lib/firebase/services";

import { QRDocument, QRData } from "@/types/qr";

interface QRContextType {
  qrCodes: QRDocument[];
  loading: boolean;
  isActionLoading: boolean;
  refreshQRCodes: () => Promise<void>;
  deleteQr: (id: string) => Promise<void>;
  updateQr: (id: string, data: Partial<QRData>, logo: Blob | null) => Promise<void>;
  saveQr: (data: QRData, logo: Blob | null) => Promise<void>;
  getQrById: (id: string) => QRData | undefined;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { runAction, loading: isActionLoading } = useSafeAction();
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QRDocument[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const loadData = async (silent = false) => {
    if (!user) {
      setQrCodes([]);
      setIsInitialLoading(false);
      return;
    }

    if (!silent) setIsInitialLoading(true);

    try {
      const data = await services.qr.fetch(user.uid);
      setQrCodes(data as QRDocument[]);
    } catch (err) {
      console.error("Failed to load QR codes", err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const deleteQr = async (id: string) => {
    const previousCodes = [...qrCodes];

    setQrCodes((prev) => prev.filter((item) => item.id !== id));

    await runAction(() => services.qr.delete(user!.uid, id), {
      requireAuth: true,
      successMsg: "QR Code deleted",
      onError: () => setQrCodes(previousCodes),
    });
  };

  const updateQr = async (id: string, updates: Partial<QRData>, logo: Blob | null) => {
    setQrCodes((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    await runAction(() => services.qr.update(user!.uid, id, updates, logo), {
      requireAuth: true,
      successMsg: "QR Code updated",
      onSuccess: () => router.push("/dashboard"),
      onError: () => loadData(true),
    });
  };

  const saveQr = async (qrData: QRData, logo: Blob | null) => {
    if (!user) {
      router.push("/auth?mode=login");
      return;
    }
    await runAction(() => services.qr.save(user!.uid, qrData, logo), {
      requireAuth: true,
      successMsg: "QR Code saved to dashboard!",
      onSuccess: () => {
        loadData();
        router.push("/dashboard");
      },
    });
  };

  const getQrById = (id: string) => {
    return qrCodes.find((item) => item.id === id);
  };
  return (
    <QRContext.Provider
      value={{
        qrCodes,
        loading: isInitialLoading,
        isActionLoading,
        refreshQRCodes: () => loadData(true),
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
