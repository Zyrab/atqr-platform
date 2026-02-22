"use client";
import Radios from "@/components/elements/radio-group";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ColorPicker } from "@/components/ui/color-picker";
import { QRDesign } from "@/types/qr";

// Constants
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
export const frameShapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const ballhapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const bodyColors = ["#000000", "#1F2937", "#2563EB", "#7C3AED", "#DB2777", "#059669", "#F97316"];
const bgColors = ["#ffffff", "#f3f4f6", "#fef3c7", "#e0f2fe", "transparent"];

interface DesignerProps {
  design: QRDesign;
  onDesignChange: (key: keyof QRDesign, value: any) => void;
  t: any;
}
export default function Designer({ design, onDesignChange, t }: DesignerProps) {
  const { body_p, body_c, eye_f, eye_b, eye_c, bg_c } = t;
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
      <AccordionItem value="item-2">
        <AccordionTrigger>Paterns</AccordionTrigger>
        <AccordionContent>
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
              values={frameShapes}
            />

            <Radios
              label={eye_b}
              type="ball"
              value={eyeBall}
              onValueChange={(val) => onDesignChange("eyeBall", val)}
              values={ballhapes}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Colors</AccordionTrigger>
        <AccordionContent>
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
            <Radios
              label={bg_c}
              type="color"
              value={bgColor}
              onValueChange={(val) => onDesignChange("bgColor", val)}
              values={bgColors}
              shape="circle"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
