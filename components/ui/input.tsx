import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

// --- 1. Base Input Component ---

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function Input({ className, type, startIcon, endIcon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {startIcon && (
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:h-6 file:text-xs file:font-medium focus-visible:ring-1 aria-invalid:ring-1 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          startIcon ? "pl-9" : "",
          endIcon ? "pr-9" : "",
          className
        )}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {endIcon}
        </div>
      )}
    </div>
  );
}

// --- 2. Base Label Component ---

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

// --- 3. The Combined "InputGroup" Component ---

interface InputGroupProps extends InputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

function InputGroup({ label, error, id, containerClassName, className, ...props }: InputGroupProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    // Added 'w-full' here to ensure it tries to fill the parent width
    <div className={cn("space-y-2 w-full", containerClassName)}>
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

// --- 4. Checkbox Component ---

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Changed rounded-none to rounded-sm for better aesthetics, revert if you prefer square
        "border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex size-4 items-center justify-center rounded-sm border transition-colors group-has-disabled/field:opacity-50 focus-visible:ring-1 aria-invalid:ring-1 peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// --- 5. Checkbox Group (Label + Checkbox) ---

interface CheckboxLabelProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label?: string;
  containerClassName?: string;
}

function CheckboxLabel({ label, id, containerClassName, className, ...props }: CheckboxLabelProps) {
  // Fix: Use useId so every checkbox is unique
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className={cn("flex items-center gap-2", containerClassName)}>
      {/* Fix: Pass ...props so onClick/checked/etc work */}
      <Checkbox id={checkboxId} className={className} {...props} />
      <Label htmlFor={checkboxId} className="font-normal cursor-pointer text-muted-foreground hover:text-foreground">
        {label}
      </Label>
    </div>
  );
}

export { Input, Label, InputGroup, Checkbox, CheckboxLabel };
