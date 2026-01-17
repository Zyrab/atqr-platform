import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// 1. Define variants using cva
const cardVariants = cva(
  "bg-card text-card-foreground border border-border shadow-sm flex flex-col overflow-hidden transition-all",
  {
    variants: {
      // 2. Add a 'width' variant to control size
      width: {
        sm: "w-full max-w-sm", // Your original default (approx 384px)
        md: "w-full max-w-md", // Approx 448px
        lg: "w-full max-w-lg", // Approx 512px
        xl: "w-full max-w-xl", // Approx 576px
        "2xl": "w-full max-w-2xl", // Approx 672px (Twice as large)
        full: "w-full", // Fills parent
        auto: "w-auto max-w-none", // Intrinsic width
      },
      // 3. Add a 'size' variant for padding/spacing
      size: {
        default: "p-8 space-y-6 rounded-xl", // Matches your Auth Card style
        sm: "p-4 space-y-3 rounded-lg text-sm",
        none: "p-0 rounded-none",
      },
    },
    defaultVariants: {
      width: "sm", // Default to small
      size: "default", // Default to standard padding
    },
  }
);

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({ className, width, size, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ width, size, className }))} {...props} />;
}

export { Card, cardVariants };
