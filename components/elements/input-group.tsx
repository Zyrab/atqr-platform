import React from "react";
import { Input, InputProps, Label } from "../ui/input";
import { cn } from "@/lib/utils";

interface InputGroupProps extends InputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export default function InputGroup({ label, error, id, containerClassName, className, ...props }: InputGroupProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <Input
        id={inputId}
        className={cn(error && "border-destructive focus-visible:ring-destructive/30", className)}
        {...props}
      />

      {error && (
        <p className="text-destructive text-[0.8rem] font-medium animate-in slide-in-from-top-1 fade-in-0">{error}</p>
      )}
    </div>
  );
}
