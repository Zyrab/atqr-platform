import { useId } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio";

interface RadiosProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  values: T[];
}

export default function RadioTexts<T extends string>({ value, onValueChange, values }: RadiosProps<T>) {
  const id = useId();
  return (
    <RadioGroup
      className="flex flex-wrap  gap-1 bg-muted/90 p-1 justify-between"
      value={value}
      onValueChange={(val) => onValueChange(val as T)}
    >
      {values.map((fmt) => (
        <div key={fmt} className="flex-1">
          <RadioGroupItem value={fmt} id={fmt + id} className="peer sr-only" />
          <label
            htmlFor={fmt + id}
            className="flex items-center justify-center w-full px-2 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-primary peer-data-[state=checked]:shadow-sm text-muted-foreground hover:text-foreground uppercase"
          >
            {fmt}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}
