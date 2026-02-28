import React, { ChangeEvent, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxLabel } from "@/components/ui/input";
import Icons from "@/components/elements/icons";
import { QRData, QRDesign } from "@/types/qr";
import Radios from "@/components/elements/radio-group";
interface UploadLogoProps {
  design: QRDesign;
  setQrData: Dispatch<React.SetStateAction<QRData>>;
  upload: (e: ChangeEvent<HTMLInputElement>) => void;
  t: any;
}
const presetIcons = ["fb", "insta", "liin", "tiktok", "wifi", "yt"];
export default function UploadLogo({ design, setQrData, upload, t }: UploadLogoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {design.logo ? (
          <div className="relative group">
            <img
              src={design.logo}
              alt="Logo"
              className="h-16 w-16 object-contain bg-white rounded border border-border"
            />
            <button
              onClick={() => setQrData((prev: any) => ({ ...prev, design: { ...prev.design, logo: null } }))}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icons name="x" size={12} />
            </button>
          </div>
        ) : (
          <div className="h-16 w-16 border border-dashed border-muted-foreground/30 flex items-center justify-center bg-background">
            <Icons name="image" className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <Button variant="outline" size="lg" className="relative">
          <Icons name="upload" />
          {design.logo ? t.change : t.upload}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={upload} />
        </Button>
      </div>
      <Radios
        label="Preset Logos"
        size="lg"
        type="logo"
        values={presetIcons}
        value={design.logo || ""}
        onValueChange={(val) =>
          setQrData((prev: any) => ({
            ...prev,
            design: { ...prev.design, logo: `${window.location.origin}/images/preset-icons/${val}.webp` },
          }))
        }
      />
      <CheckboxLabel
        label={t.rmv_bg}
        checked={design.logoBG}
        onCheckedChange={(checked: boolean) =>
          setQrData((prev: any) => ({ ...prev, design: { ...prev.design, logoBG: checked } }))
        }
      />
      <p className="text-xs text-muted-foreground">{t.note}</p>
    </div>
  );
}
