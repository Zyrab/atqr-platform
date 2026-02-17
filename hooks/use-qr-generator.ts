import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import type { QRCodeMatrix, QRContent } from '@/types/qr';
import { chooseErrorCorrection } from "@/lib/error-correction-level";


// Debounce helper
function useDebouncedValue<T>(value: T, delay: number): T {
  return useMemo(() => value, [value, delay]);
}

function getQRString(content: QRContent): string | null {
  switch (content.type) {
    case 'url':
      return content.url.trim() || null;
    case 'text':
      return content.text.trim() || null;
    case 'wifi':
      if (!content.ssid.trim()) return null; // SSID is required
      return `WIFI:T:WPA;S:${content.ssid};P:${content.password};;`;
    default:
      return null;
  }
}



export const useQRCodeGenerator = (
  content: QRContent,
  hasLogo: boolean,
  debounceMs = 800
) => {
  const debouncedContent = useDebouncedValue(content, debounceMs);
  
  const matrix: QRCodeMatrix = useMemo(() => {
    if (!debouncedContent) return [];
    const ecLevel = chooseErrorCorrection({ content, hasLogo});
    
    const qrString = getQRString(debouncedContent);
    if (!qrString) return [];

    try {
      
      const qrRaw = QRCode.create(qrString, { errorCorrectionLevel: ecLevel } );
      const size = qrRaw.modules.size;
      const data = qrRaw.modules.data;

      const result: boolean[][] = Array.from({ length: size }, (_, y) =>
        Array.from({ length: size }, (_, x) => data[y * size + x] === 1)
      );

      return result;
    } catch {
      return [];
    }
  }, [debouncedContent, hasLogo]);

  return { matrix };
};