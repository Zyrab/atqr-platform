import { QRContent, QRData } from "@/types/qr";

export const contentCheckers: Record<QRContent["type"], (content: QRContent) => boolean> = {
  url: (content) => (content.type === "url" ? content?.url?.trim() !== "" : false),
  text: (content) => (content.type === "text" ? content?.text?.trim() !== "" : false),
  wifi: (content) => content.type === "wifi" ? content?.ssid?.trim() !== "" || content?.password?.trim() !== "" : false,
};

export function resolveQRString(qrData: QRData): string | null {
  if (qrData.type === "dynamic" && qrData.slug) {
    return `https://r.atqr.app/${qrData.slug}`;
  }

  const content = qrData.content;
  switch (content.type) {
    case 'url': return content.url?.trim() || null;
    case 'text': return content.text?.trim() || null;
    case 'wifi': 
      if (!content.ssid?.trim()) return null;
      return `WIFI:T:WPA;S:${content.ssid};P:${content.password};H:${content.hidden};;`;
    default: return null;
  }
}