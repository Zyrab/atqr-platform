"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import Section from "@/components/layout/section";
import Radios from "@/components/elements/radio-group";

import InputArea from "./input-area";
import UploadLogo from "./upload-logo";

import { generateQRCode, resizeImage, QRStyle, LogoStyle } from "@/lib/qr-utils";
import { saveQrToHistory, updateQrCode } from "@/lib/firebase";

import { bodyShapes, bodyColors } from "./svg-shapes";

const bgColors = [
  { value: "#ffffff", color: "#ffffff", label: "White" },
  { value: "#f3f4f6", color: "#f3f4f6", label: "Gray" },
  { value: "#fef3c7", color: "#fef3c7", label: "Yellow" },
  { value: "#e0f2fe", color: "#e0f2fe", label: "Light Blue" },
];

// --- Types ---
interface FormData {
  url: string;
  name: string;
  color: string;
  bgColor: string;
  logo: string | null;
  style: QRStyle; // Maps to Body Shape
  logoStyle: LogoStyle;
  // Extra visual fields (can be expanded in qr-utils later)
  eyeFrame: string;
  eyeBall: string;
}

export default function Generator() {
  const router = useRouter();
  const { user } = useAuth();

  // Refs & Loading State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [saving, setSaving] = useState(false);

  // Consolidated State
  const [formData, setFormData] = useState<FormData>({
    url: "",
    name: "",
    color: "#000000",
    bgColor: "#ffffff",
    logo: null,
    style: "square",
    logoStyle: "square",
    eyeFrame: "square",
    eyeBall: "square",
  });

  // --- Effect: Generate QR on Change ---
  useEffect(() => {
    if (canvasRef.current && formData.url) {
      // Debounce slightly to prevent flashing on rapid typing
      const timer = setTimeout(() => {
        generateQRCode(
          canvasRef.current!,
          formData.url,
          {
            color: formData.color,
            style: formData.style,
            logoStyle: formData.logoStyle,
            // Pass extra options if your generateQRCode updates to support them:
            // bgColor: formData.bgColor
          },
          formData.logo
        );
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  // --- Handlers ---

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        // Use a toast here in a real app
        alert("File too large. Please upload an image under 2MB.");
        return;
      }
      try {
        const resizedBase64 = await resizeImage(file);
        setFormData((prev) => ({ ...prev, logo: resizedBase64 }));
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/auth?mode=login"); // Redirect to login if not auth
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        color: formData.color,
        bgColor: formData.bgColor,
        style: formData.style,
        logoStyle: formData.logoStyle,
        name: formData.name || "Untitled QR",
        eyeFrame: formData.eyeFrame,
        eyeBall: formData.eyeBall,
      };

      // Create new
      await saveQrToHistory(user, formData.url, formData.logo, dataToSave);

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section>
      <Card width="xl">
        <InputArea
          url={formData.url}
          name={formData.name}
          onUrlChange={(e) => setFormData({ ...formData, url: e.target.value })}
          onNameChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <Radios
            label="Body Pattern"
            value={formData.style}
            onValueChange={(val) => setFormData({ ...formData, style: val as QRStyle })}
            items={bodyShapes}
            size="lg"
          />

          <Radios
            label="Body Color"
            value={formData.color}
            onValueChange={(val) => setFormData({ ...formData, color: val })}
            items={bodyColors}
            shape="circle"
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <Radios
            label="Eye Frame"
            value={formData.eyeFrame}
            onValueChange={(val) => setFormData({ ...formData, eyeFrame: val })}
            items={bodyShapes}
          />

          <Radios
            label="Eye Ball"
            value={formData.eyeBall}
            onValueChange={(val) => setFormData({ ...formData, eyeBall: val })}
            items={bodyShapes}
          />
        </div>

        <Radios
          label="Background Color"
          value={formData.bgColor}
          onValueChange={(val) => setFormData({ ...formData, bgColor: val })}
          items={bgColors}
          shape="circle"
        />

        <UploadLogo formData={formData} setFormData={setFormData} handleImageUpload={handleImageUpload} />
      </Card>

      <Card width="sm">
        <div
          className="aspect-square flex items-center justify-center rounded-lg border border-border relative overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: formData.bgColor }}
        >
          {!formData.url && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 backdrop-blur-[1px]">
              <span className="text-sm font-medium text-muted-foreground bg-background/80  rounded-full border shadow-sm">
                Enter URL to generate
              </span>
            </div>
          )}

          {/* The Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full max-w-75 max-h-75 object-contain"
            style={{ imageRendering: formData.style === "dots" ? "auto" : "pixelated" }}
          />
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            className="w-full font-bold shadow-sm"
            disabled={!formData.url || saving}
            onClick={handleSave}
          >
            {saving ? <Loader2 className="animate-spin mr-2" /> : null}
            {user ? "Save to Dashboard" : "Sign in to Save"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {user ? "Saved designs can be edited later" : "You'll be redirected to login"}
          </p>
        </div>
      </Card>
    </Section>
  );
}
