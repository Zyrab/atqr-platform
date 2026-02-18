type DotType = string;
type EyeType = string;
export type QRCodeMatrix = boolean[][];

type UrlContent = { type: 'url'; url: string };
type TextContent = { type: 'text'; text: string };
type WifiContent = { type: 'wifi'; ssid: string; password: string };
type QrType = "static" | "dynamic"

export type QRContent = UrlContent | TextContent | WifiContent;
export type ErrorCorrection = "L" | "M" | "Q" | "H";


export interface QRDesign {
  dotType: DotType;
  eyeFrame?: EyeType;
  eyeBall?: EyeType;
  bodyColor?: string;
  eyeColor?: string;
  bgColor?: string;
  logo?: string | null;
  logoBG: boolean;
  logoStyle?: 'square' | 'circle';
  logoSizeRatio?: number;
}

export interface QRData {
  name: string;
  content: QRContent;
  design: QRDesign;
  type: QrType;
  qrId?: string;
}

export interface QRDocument extends QRData {
  id: string;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRCodeRendererProps {
  matrix: QRCodeMatrix;
  size?: number;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  design: QRDesign
}
