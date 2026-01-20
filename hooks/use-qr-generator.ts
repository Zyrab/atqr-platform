import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import type { QRCodeMatrix, QRContent } from '@/types/qr';


// Debounce helper
function useDebounce<QRContent>(value: QRContent, delay: number): QRContent {
  const [debouncedValue, setDebouncedValue] = useState<QRContent>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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
  content: QRContent | null,
  options: { errorCorrectionLevel: "L" | "M" | "Q" | "H" } = { errorCorrectionLevel: "H" },
) => {
  const [matrix, setMatrix] = useState<QRCodeMatrix>([]);

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (!debouncedContent) {
      setMatrix([]);
      return;
    }

    const generate = async () => {
      try {
        const qrString = getQRString(debouncedContent);
        if (!qrString) {
        setMatrix([]);
        return;
      }
        const qrRaw = QRCode.create(qrString, options);
        const size = qrRaw.modules.size;
        const data = qrRaw.modules.data;

        const newMatrix: boolean[][] = [];
        for (let y = 0; y < size; y++) {
          const row: boolean[] = [];
          for (let x = 0; x < size; x++) {
            row.push(data[y * size + x] === 1);
          }
          newMatrix.push(row);
        }
        setMatrix(newMatrix);
      } catch (err) {
        console.error("QR Generation failed", err);
      }
    };

    generate();
  }, [debouncedContent, options.errorCorrectionLevel]);

  return { matrix };
};
