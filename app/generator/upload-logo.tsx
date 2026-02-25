import React, { ChangeEvent, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxLabel } from "@/components/ui/input";
import { X, ImageIcon, Upload } from "lucide-react";
import { QRData, QRDesign } from "@/types/qr";
interface UploadLogoProps {
  design: QRDesign;
  setQrData: Dispatch<React.SetStateAction<QRData>>;
  upload: (e: ChangeEvent<HTMLInputElement>) => void;
  t: any;
}

export default function UploadLogo({ design, setQrData, upload, t }: UploadLogoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div>
        <Button variant="outline" className="relative">
          <Upload />
          {design.logo ? t.change : t.upload}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={upload} />
        </Button>
        <p className="text-xs text-muted-foreground">{t.note}</p>
      </div>

      {design.logo ? (
        <div className="relative group">
          <img
            src={design.logo}
            alt="Logo"
            className="h-12 w-12 object-contain bg-white rounded border border-border"
          />
          <button
            onClick={() => setQrData((prev: any) => ({ ...prev, design: { ...prev.design, logo: null } }))}
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
      <CheckboxLabel
        label={t.rmv_bg}
        checked={design.logoBG}
        onCheckedChange={(checked: boolean) =>
          setQrData((prev: any) => ({ ...prev, design: { ...prev.design, logoBG: checked } }))
        }
      />
    </div>
  );
}
