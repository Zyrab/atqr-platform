import { RadioGroup, RadioCard, RadioGroupItem } from "../ui/radio";
import { Label } from "../ui/input";
import { cn } from "@/lib/utils";
// 1. Define the shape of your items
export interface RadioOption {
  value: string;
  icon?: string;
  color?: string;
}

interface RadiosProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  items: RadioOption[];
  className?: string;
  shape?: "circle" | "default" | "square" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export default function Radios({ label, value, onValueChange, items, className, shape, size }: RadiosProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label>{label}</Label>}

      <RadioGroup value={value} onValueChange={onValueChange}>
        {items.map((item) => (
          <RadioCard key={item.value} value={item.value} shape={shape} size={size}>
            {item.icon && (
              <svg
                className="w-full text-foreground"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 25 25"
              >
                <path d={item.icon} fill={item.color ? item.color : "currentColor"} />
              </svg>
            )}
          </RadioCard>
        ))}
      </RadioGroup>
    </div>
  );
}
