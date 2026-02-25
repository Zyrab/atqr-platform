import { useMemo } from "react";
import QRCode from "qrcode";
import type { QRCodeMatrix, ErrorCorrection } from '@/types/qr';


type DecideECInput = {
  length: number;
  hasLogo: boolean;
};


export function chooseErrorCorrection({ length = 0, hasLogo }: DecideECInput): ErrorCorrection {
 
  if (!hasLogo) {
    if (length < 20) return "M";
    return "L";
  }

  if (length <= 25) return "H";
  if (length <= 150) return "Q";
  return "M";
}

export const useQRCodeGenerator =  (value: string | null, hasLogo: boolean) => {


  const matrix: QRCodeMatrix = useMemo(() => {
    if (!value) return [];

    const ecLevel = chooseErrorCorrection({ length: value?.length || 0, hasLogo});
    

    try {
      
      const qrRaw = QRCode.create(value, { errorCorrectionLevel: ecLevel } );
      const size = qrRaw.modules.size;
      const data = qrRaw.modules.data;

      const result: boolean[][] = Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => data[y * size + x] === 1) );

      return result;
    } catch {
      return [];
    }
  }, [value, hasLogo]);

  return { matrix };
};