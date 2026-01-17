import * as React from "react";
import { InputGroup } from "@/components/ui/input";
import { Link } from "lucide-react";

interface InputAreaProps {
  url: string;
  name: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputArea({ url, name, onUrlChange, onNameChange }: InputAreaProps) {
  return (
    <div className="w-full flex flex-col gap-6 md:flex-row">
      <InputGroup
        label="URL"
        value={url}
        onChange={onUrlChange}
        placeholder="https://example.com"
        startIcon={<Link size={16} />}
        required
      />
      <InputGroup
        label="QR Name (optional)"
        value={name}
        onChange={onNameChange}
        placeholder="Only used if you sign in and save"
      />
    </div>
  );
}
