import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input"; // Using your custom Label
import { cn } from "@/lib/utils";
import { X, ImageIcon, Upload } from "lucide-react";
import { LogoStyle } from "@/lib/qr-utils";

// Define the interface for the parent's form data
// We use a partial or specific pick here to ensure loose coupling
interface LogoFormData {
  logo: string | null;
  logoStyle: LogoStyle;
}

interface UploadLogoProps {
  formData: LogoFormData;
  setFormData: (data: any) => void; // Using any to allow flexible state updates, or could be specific
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const logoStyles: { value: LogoStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
  { value: "trace", label: "Trace" },
  { value: "none", label: "None" },
];

export default function UploadLogo({ formData, setFormData, handleImageUpload }: UploadLogoProps) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Logo Overlay</Label>
      <div className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left Side: Preview */}
        <div className="flex items-center gap-4 flex-1">
          {formData.logo ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.logo}
                alt="Logo"
                className="h-12 w-12 object-contain bg-white rounded border border-border"
              />
              <button
                onClick={() => setFormData((prev: any) => ({ ...prev, logo: null }))}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="h-12 w-12 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center bg-background">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1">
            <div className="relative">
              <Button variant="outline" size="sm" className="relative w-full md:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                {formData.logo ? "Change Logo" : "Upload Logo"}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Style Selector */}
        {formData.logo && (
          <div className="flex gap-2">
            {logoStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => setFormData((prev: any) => ({ ...prev, logoStyle: style.value }))}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                  formData.logoStyle === style.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover:bg-accent"
                )}
              >
                {style.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
