import { QRContent } from "@/types/qr";

type ErrorCorrection = "L" | "M" | "Q" | "H";

type DecideECInput = {
  content: QRContent;
  hasLogo: boolean;
  logoScale?: number; // 0–1 (relative width of QR, default ~0.2)
};

export function chooseErrorCorrection({ content, hasLogo, logoScale = 0.2 }: DecideECInput): ErrorCorrection {
  
  let payloadLength = 0;

  switch (content.type) {
    case "url":
      payloadLength = content.url.length;
      break;
    case "text":
      payloadLength = content.text.length;
      break;
    case "wifi":
      payloadLength =
        content.ssid.length +
        content.password.length +
        20; // protocol overhead
      break;
  }

  const logoAreaRatio = hasLogo ? logoScale * logoScale : 0;

  if (!hasLogo) {
    if (payloadLength < 120) return "L";
    if (payloadLength < 250) return "M";
    return "Q";
  }

  if ( payloadLength < 120 && logoAreaRatio <= 0.06 ) return "L";

  if ( payloadLength < 250 && logoAreaRatio <= 0.1 ) return "M";

  if ( payloadLength < 400 && logoAreaRatio <= 0.16 ) return "Q"; 

  return "H";
}
