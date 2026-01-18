import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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

export const useQRCodeGenerator = (
  content: string,
  options: { errorCorrectionLevel: "L" | "M" | "Q" | "H" } = { errorCorrectionLevel: "H" },
) => {
  const [matrix, setMatrix] = useState<(number | boolean)[][]>([]);

  // 1. Debounce the input content.
  // This means the heavy QR generation only happens 300ms AFTER you stop typing.
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (!debouncedContent) {
      setMatrix([]);
      return;
    }

    const generate = async () => {
      try {
        const qrRaw = QRCode.create(debouncedContent, options);
        const size = qrRaw.modules.size;
        const data = qrRaw.modules.data;

        const newMatrix = [];
        for (let y = 0; y < size; y++) {
          const row = [];
          for (let x = 0; x < size; x++) {
            const idx = y * size + x;
            row.push(data[idx] ? 1 : 0);
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
