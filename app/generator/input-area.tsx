import * as React from "react";
import { CheckboxLabel, InputGroup } from "@/components/ui/input";
import { QRContent } from "@/types/qr";
import Icons from "@/components/elements/icons";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import RadioTexts from "@/components/elements/radio-text";

interface InputAreaProps {
  content: QRContent;
  name: string;
  onContentChange: (field: string, value: string | boolean) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContentTypeChange: (type: QRContent["type"]) => void;
  isEditing: boolean;
  t: any;
}

export default function InputArea({
  content,
  name,
  onContentChange,
  onNameChange,
  handleContentTypeChange,
  isEditing,
  t,
}: InputAreaProps) {
  const activeFields = INPUT_FIELDS[content.type as keyof typeof INPUT_FIELDS] || [];
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Content</AccordionTrigger>
      <AccordionContent>
        {!isEditing && (
          <RadioTexts values={["url", "text", "wifi"]} value={content.type} onValueChange={handleContentTypeChange} />
        )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputGroup
            label={t.name.text}
            value={name}
            onChange={(e) => onNameChange(e)}
            placeholder={t.name.placeholder}
          />
          {activeFields.map(({ key, icon, requred, type }, i) =>
            type !== "checkbox" ? (
              <InputGroup
                key={i}
                label={t[key].text}
                type={type}
                value={(content as any)[key] || ""}
                onChange={(e) => onContentChange(key, e.target.value)}
                placeholder={t[key].placeholder}
                startIcon={<Icons name={icon} size={16} />}
                required={requred}
              />
            ) : (
              <CheckboxLabel
                key={i}
                label={t[key].text}
                id={key}
                onCheckedChange={(c: boolean) => onContentChange(key, c)}
              />
            ),
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export const INPUT_FIELDS = {
  url: [{ key: "url", icon: "link", type: "text", requred: true }],
  text: [{ key: "text", icon: "type", type: "text", requred: true }],
  wifi: [
    { key: "ssid", icon: "wifi", type: "text", requred: true },
    { key: "password", icon: "key_round", type: "text", requred: false },
    { key: "hidden", icon: "", type: "checkbox", requred: false },
  ],
  // email: [ { key: "email", labelKey: "email.addr", ... }, { key: "subject", ... } ]
};
