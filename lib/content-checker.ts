import { QRContent } from "@/types/qr";

export const contentCheckers: Record<QRContent["type"], (content: QRContent) => boolean> = {
  url: (content) => (content.type === "url" ? content?.url?.trim() !== "" : false),
  text: (content) => (content.type === "text" ? content?.text?.trim() !== "" : false),
  dynamic: (content) => (content.type === "text" ? content?.text?.trim() !== "" : false),
  wifi: (content) => content.type === "wifi" ? content?.ssid?.trim() !== "" || content?.password?.trim() !== "" : false,
};