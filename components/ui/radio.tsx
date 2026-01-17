import * as React from "react";
import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

// 1. RadioGroup: Removed forced 'flex-row' so you can use Grid
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("flex flex-row gap-2", className)} {...props} />;
}

// 2. Standard Radio Item (Small circle)
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

// 3. RadioCard (The main upgrade)
// Define variants for Shape and Size
const radioCardVariants = cva(
  "relative flex flex-col items-center justify-center border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-foreground data-[state=checked]:bg-foreground/5 data-[state=checked]:ring-1 data-[state=checked]:ring-foreground transition-all focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
  {
    variants: {
      shape: {
        default: "rounded-xl",
        square: "rounded-md",
        circle: "rounded-full aspect-square",
      },
      size: {
        default: "w-8 h-8 p-0.5",
        sm: "w-6 h-6 p-0.5",
        lg: "w-12 h-12 p-1.5",
        icon: "p-1.5",
      },
    },
    defaultVariants: {
      shape: "default",
      size: "default",
    },
  }
);

interface RadioCardProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioCardVariants> {
  children?: React.ReactNode;
}

function RadioCard({ className, children, shape, size, ...props }: RadioCardProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      className={cn(radioCardVariants({ shape, size, className }))}
      {...props}
    >
      <div className="sr-only">
        <RadioGroupPrimitive.Indicator />
      </div>
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioCard, radioCardVariants };
