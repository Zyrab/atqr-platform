"use client";
import Radios from "@/components/elements/radio-group";
import { ColorPicker } from "@/components/ui/color-picker";
import { QRDesign } from "@/types/qr";

export const bodyColors = ["#000000", "#1F2937", "#2563EB", "#7C3AED", "#DB2777", "#059669", "#F97316"];
const bgColors = ["#ffffff", "#f3f4f6", "#fef3c7", "#e0f2fe", "transparent"];

interface DesignerProps {
  design: QRDesign;
  onDesignChange: (key: keyof QRDesign, value: any) => void;
  t: any;
}
export default function ColorsDesigner({ design, onDesignChange, t }: DesignerProps) {
  const { body_c, eye_c, bg_c } = t;
  const { bodyColor = "#00000", eyeColor = "#000000", bgColor = "#ffffff" } = design;
  return (
    <div className="w-full flex flex-col gap-6 p-0.5">
      <div className="flex flex-wrap gap-2 items-end">
        <Radios
          label={body_c}
          type="color"
          value={bodyColor}
          onValueChange={(val) => onDesignChange("bodyColor", val)}
          values={bodyColors}
          shape="circle"
        />
        <ColorPicker value={bodyColor} onChange={(val) => onDesignChange("bodyColor", val)} />
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <Radios
          label={eye_c}
          type="color"
          value={eyeColor}
          onValueChange={(val) => onDesignChange("eyeColor", val)}
          values={bodyColors}
          shape="circle"
        />
        <ColorPicker value={eyeColor} onChange={(val) => onDesignChange("eyeColor", val)} />
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <Radios
          label={bg_c}
          type="color"
          value={bgColor}
          onValueChange={(val) => onDesignChange("bgColor", val)}
          values={bgColors}
          shape="circle"
        />
        <ColorPicker value={bgColor} onChange={(val) => onDesignChange("bgColor", val)} />
      </div>
    </div>
  );
}
