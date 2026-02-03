"use client";
import Radios from "@/components/elements/radio-group";
import { ColorPicker } from "@/components/ui/color-picker";
import { QRDesign } from "@/types/qr";

// Constants
export const bodyShapes = [
  "square",
  "softSquare",
  "circle",
  "pill",
  "blob",
  "fluid",
  "cutCorner",
  "blobH",
  "blobV",
  // "extraFluid",
  // "sharp",
  // "leaf",
];
export const frameShapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const ballhapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const bodyColors = ["#000000", "#1F2937", "#2563EB", "#7C3AED", "#DB2777", "#059669", "#F97316"];
const bgColors = ["#ffffff", "#f3f4f6", "#fef3c7", "#e0f2fe", "transparent"];

interface DesignerProps {
  design: QRDesign;
  onDesignChange: (key: keyof QRDesign, value: any) => void;
}
export default function Designer({ design, onDesignChange }: DesignerProps) {
  const {
    dotType,
    bodyColor = "#00000",
    eyeFrame = "square",
    eyeBall = "square",
    eyeColor = "#000000",
    bgColor = "#ffffff",
  } = design;
  return (
    <>
      <Radios
        label="Body Pattern"
        type="body"
        value={dotType}
        onValueChange={(val) => onDesignChange("dotType", val)}
        values={bodyShapes}
        size="lg"
      />
      <div className="flex flex-wrap gap-2 items-end">
        <Radios
          label="Body Color"
          type="color"
          value={bodyColor}
          onValueChange={(val) => onDesignChange("bodyColor", val)}
          values={bodyColors}
          shape="circle"
        />
        <ColorPicker value={bodyColor} onChange={(val) => onDesignChange("bodyColor", val)} />
      </div>

      <div className="w-full flex flex-col gap-6 md:flex-row">
        <Radios
          label="Eye Frame"
          type="frame"
          value={eyeFrame}
          onValueChange={(val) => onDesignChange("eyeFrame", val)}
          values={frameShapes}
        />

        <Radios
          label="Eye Ball"
          type="ball"
          value={eyeBall}
          onValueChange={(val) => onDesignChange("eyeBall", val)}
          values={ballhapes}
        />
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <Radios
          label="Eye Color"
          type="color"
          value={eyeColor}
          onValueChange={(val) => onDesignChange("eyeColor", val)}
          values={bodyColors}
          shape="circle"
        />
        <ColorPicker value={eyeColor} onChange={(val) => onDesignChange("eyeColor", val)} />
      </div>
      <Radios
        label="Background Color"
        type="color"
        value={bgColor}
        onValueChange={(val) => onDesignChange("bgColor", val)}
        values={bgColors}
        shape="circle"
      />
    </>
  );
}
