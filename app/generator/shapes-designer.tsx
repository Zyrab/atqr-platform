"use client";
import Radios from "@/components/elements/radio-group";
import { QRDesign } from "@/types/qr";

export const bodyShapes = [
  "square",
  "softSquare",
  "circle",
  "dot",
  "pill",
  "fluid",
  "cutCorner",
  "blobH",
  "blobV",
  "sharp",
];
const eyeShapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];

interface DesignerProps {
  design: QRDesign;
  onDesignChange: (key: keyof QRDesign, value: any) => void;
  t: any;
}
export default function ShapesDesigner({ design, onDesignChange, t }: DesignerProps) {
  const { body_p, eye_f, eye_b } = t;
  const { dotType, eyeFrame = "square", eyeBall = "square" } = design;
  return (
    <div className="w-full flex flex-col gap-6 p-0.5">
      <Radios
        label={body_p}
        type="body"
        value={dotType}
        onValueChange={(val) => onDesignChange("dotType", val)}
        values={bodyShapes}
        size="lg"
      />
      <Radios
        label={eye_f}
        type="frame"
        value={eyeFrame}
        onValueChange={(val) => onDesignChange("eyeFrame", val)}
        values={eyeShapes}
      />

      <Radios
        label={eye_b}
        type="ball"
        value={eyeBall}
        onValueChange={(val) => onDesignChange("eyeBall", val)}
        values={eyeShapes}
      />
    </div>
  );
}
