import { RadioGroup, RadioCard } from "../ui/radio";
import { Label } from "../ui/input";
import { cn } from "@/lib/utils";
import { BodyPreview, BallPreview, FramePreview, ColorPreview } from "@/components/layout/rendering/body-preview";
import Image from "next/image";

interface RadiosProps {
  label?: string;
  value: string;
  type: "body" | "ball" | "frame" | "color" | "logo";
  onValueChange: (value: string) => void;
  values: string[];
  className?: string;
  shape?: "circle" | "default" | "square" | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
}

function renderPreview(type: string, item: string) {
  switch (type) {
    case "body":
      return <BodyPreview type={item} />;
    case "ball":
      return <BallPreview type={item} />;
    case "frame":
      return <FramePreview type={item} />;
    case "color":
      return <ColorPreview color={item} />;
    case "logo":
      return <Image src={`/images/preset-icons/${item}.webp`} alt={item} width="34" height="34" />;
    default:
      return null;
  }
}

export default function Radios({ label, value, onValueChange, type, values, shape, size, className }: RadiosProps) {
  return (
    <div className={cn("flex flex-col items-start gap-0.5", className)}>
      {label && <Label>{label}</Label>}

      <RadioGroup value={value} onValueChange={onValueChange}>
        {values.map((val) => (
          <RadioCard key={val} value={val} shape={shape} size={size}>
            {renderPreview(type, val)}
          </RadioCard>
        ))}
      </RadioGroup>
    </div>
  );
}
