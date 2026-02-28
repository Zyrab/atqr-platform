import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./input";

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:bg-input/50 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-none border bg-transparent px-2.5 py-2 text-sm transition-colors outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1",
        className,
      )}
      {...props}
    />
  );
}

interface TextareaGroupProps extends TextareaProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

function TextareaGroup({ label, error, id, containerClassName, className, ...props }: TextareaGroupProps) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <Textarea
        id={textareaId}
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-destructive text-[0.8rem] font-medium animate-in slide-in-from-top-1 fade-in-0">{error}</p>
      )}
    </div>
  );
}

export { Textarea, TextareaGroup };
