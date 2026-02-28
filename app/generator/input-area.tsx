import React, { Dispatch } from "react";
import { CheckboxLabel } from "@/components/ui/input";
import { TextareaGroup } from "@/components/ui/textarea";
import { QRContent, QRData } from "@/types/qr";
import Icons from "@/components/elements/icons";
import InputGroup from "@/components/elements/input-group";

interface InputAreaProps {
  qrData: QRData;
  setQrData: Dispatch<React.SetStateAction<QRData>>;
  dynamicAllowed: boolean;
  t: any;
}

export default function InputArea({ qrData, setQrData, dynamicAllowed, t }: InputAreaProps) {
  const activeFields = INPUT_FIELDS[qrData.content.type] || [];

  const handleContentChange = (key: string, value: string | boolean) => {
    setQrData((prev) => ({
      ...prev,
      content: { ...prev.content, [key]: value } as QRContent,
    }));
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
      <InputGroup
        label={t.name.text}
        value={qrData.name}
        onChange={(e) => setQrData((prev) => ({ ...prev, name: e.target.value }))}
        placeholder={t.name.placeholder}
      />

      {activeFields.map(({ key, icon, required, type }, i) => {
        if (type === "checkbox") {
          return (
            <CheckboxLabel
              key={i}
              label={t[key]?.text}
              id={key}
              checked={!!(qrData.content as any)[key]}
              onCheckedChange={(c: boolean) => handleContentChange(key, c)}
            />
          );
        } else if (type === "textarea") {
          return (
            <TextareaGroup
              key={i}
              label={t[key]?.text}
              id={key}
              value={(qrData.content as any)[key] ?? ""}
              onChange={(e) => handleContentChange(key, e.target.value)}
              placeholder={t[key]?.placeholder}
              required={required}
            />
          );
        } else {
          return (
            <InputGroup
              key={i}
              label={t[key]?.text}
              type={type}
              value={(qrData.content as any)[key] ?? ""}
              onChange={(e) => handleContentChange(key, e.target.value)}
              placeholder={t[key]?.placeholder}
              startIcon={icon ? <Icons name={icon} size={16} /> : null}
              required={required}
            />
          );
        }
      })}
      {qrData.content.type === "url" && dynamicAllowed && (
        <CheckboxLabel
          label={"Analytics & Tracking"}
          id="qr-type"
          disabled={qrData.content.type !== "url"}
          checked={qrData.type === "dynamic"}
          onCheckedChange={(c: boolean) => setQrData((p) => ({ ...p, type: c ? "dynamic" : "static" }))}
        />
      )}
    </div>
  );
}
interface FieldConfig {
  key: string;
  icon: string;
  type: "text" | "checkbox" | "password" | "textarea";
  required: boolean;
}

export const INPUT_FIELDS: Record<QRContent["type"], FieldConfig[]> = {
  url: [{ key: "url", icon: "link", type: "text", required: true }],
  text: [{ key: "text", icon: "type", type: "textarea", required: true }],
  wifi: [
    { key: "ssid", icon: "wifi", type: "text", required: true },
    { key: "password", icon: "key_round", type: "text", required: false },
    { key: "hidden", icon: "", type: "checkbox", required: false },
  ],
};
