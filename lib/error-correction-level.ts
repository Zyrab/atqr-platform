import { QRContent } from "@/types/qr";

type ErrorCorrection = "L" | "M" | "Q" | "H";

type DecideECInput = {
  content: QRContent;
  hasLogo: boolean;
};

export function chooseErrorCorrection({ content, hasLogo }: DecideECInput): ErrorCorrection {
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
        (content.ssid?.length || 0) +
        (content.password?.length || 0) +
        20; 
      break;
    default:
      payloadLength = 0;
  }

  if (!hasLogo) {
    if (payloadLength < 20) return "M";

    return "L";
  }

  if (payloadLength <= 25) return "H";

  if (payloadLength <= 150) return "Q";
  
  return "M";
}