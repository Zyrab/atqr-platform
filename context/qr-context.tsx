"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { QRDesignState, SavedQR } from "@/lib/qr-types";

// Default starting state
const defaultDesign: QRDesignState = {
  url: "",
  name: "",
  fgColor: "#000000",
  bgColor: "#ffffff",
  eyeFrameColor: "#000000",
  eyeBallColor: "#000000",
  dotStyle: "square",
  eyeFrameStyle: "square",
  eyeBallStyle: "square",
  logo: null,
  logoStyle: "clean-cut",
};

interface QRContextType {
  design: QRDesignState;
  setDesign: React.Dispatch<React.SetStateAction<QRDesignState>>;
  loadForEditing: (qr: SavedQR) => void;
  resetDesign: () => void;
  isEditingId: string | null; // Keeps track if we are updating an old one
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: ReactNode }) {
  const [design, setDesign] = useState<QRDesignState>(defaultDesign);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const loadForEditing = (qr: SavedQR) => {
    // Populate state with saved data
    setDesign({
      url: qr.text, // Mapping legacy 'text' to 'url'
      name: qr.name || "",
      fgColor: qr.fgColor || "#000000",
      bgColor: qr.bgColor || "#ffffff",
      eyeFrameColor: qr.eyeFrameColor || "#000000",
      eyeBallColor: qr.eyeBallColor || "#000000",
      dotStyle: qr.dotStyle || "square",
      eyeFrameStyle: qr.eyeFrameStyle || "square",
      eyeBallStyle: qr.eyeBallStyle || "square",
      logo: qr.logoBase64 || null,
      logoStyle: qr.logoStyle || "clean-cut",
    });
    setIsEditingId(qr.id);
  };

  const resetDesign = () => {
    setDesign(defaultDesign);
    setIsEditingId(null);
  };

  return (
    <QRContext.Provider value={{ design, setDesign, loadForEditing, resetDesign, isEditingId }}>
      {children}
    </QRContext.Provider>
  );
}

export const useQR = () => {
  const context = useContext(QRContext);
  if (!context) throw new Error("useQR must be used within QRProvider");
  return context;
};
