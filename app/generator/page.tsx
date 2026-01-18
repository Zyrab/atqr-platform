"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import QRCode from "qrcode";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Section from "@/components/layout/section";
import Radios from "@/components/elements/radio-group";
import { HeaderGroup } from "@/components/elements/heading-group";
import InputArea from "./input-area";
import UploadLogo from "./upload-logo";
import QRCodeRenderer from "./renderer"; // Assuming file is in same folder

import { saveQrToHistory } from "@/lib/firebase";
// Assuming you have a utility for image resizing, keeping import
import { resizeImage } from "@/lib/qr-utils";
import AdSpace from "@/components/ui/ad-space";

export const bodyShapes = ["square", "softSquare", "circle", "pill", "blob", "fluid", "cutCorner", "blobH", "blobV"];
export const frameShapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];
export const ballhapes = ["square", "circle", "soft", "leaf", "eye", "drop", "hex"];

export const bodyColors = ["#000000", "#1F2937", "#2563EB", "#7C3AED", "#DB2777", "#059669", "#F97316"];

const bgColors = ["#ffffff", "#f3f4f6", "#fef3c7", "#e0f2fe", "transparent"];

// --- Types ---
interface FormData {
  url: string;
  name: string;
  color: string;
  bgColor: string;
  logo: string | null;
  style: string;
  logoStyle: string;
  eyeFrame: string;
  eyeBall: string;
}

export default function Generator({ showHeader = false }: { showHeader: boolean }) {
  const router = useRouter();
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);

  // QR Matrix State
  const [matrix, setMatrix] = useState<(number | boolean)[][]>([]);

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

  // --- Effect: Generate QR Data on Change ---
  useEffect(() => {
    if (!formData.url) {
      setMatrix([]);
      return;
    }

    // Debounce generation slightly
    const timer = setTimeout(() => {
      try {
        // Generate Raw Data
        const qrRaw = QRCode.create(formData.url, { errorCorrectionLevel: "H" });
        const size = qrRaw.modules.size;
        const data = qrRaw.modules.data;

        // Transform Uint8Array into 2D Boolean/Number Array
        const newMatrix = [];
        for (let y = 0; y < size; y++) {
          const row = [];
          for (let x = 0; x < size; x++) {
            // Calculate index in the flat data array
            const idx = y * size + x;
            row.push(data[idx] ? 1 : 0);
          }
          newMatrix.push(row);
        }

        setMatrix(newMatrix);
      } catch (err) {
        console.error("QR Generation failed", err);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [formData.url]);

  // --- Handlers ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File too large. Please upload an image under 2MB.");
        return;
      }
      try {
        // Assuming resizeImage returns a base64 string
        const resizedBase64 = await resizeImage(file);
        setFormData((prev) => ({ ...prev, logo: resizedBase64 }));
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/auth?mode=login");
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

      await saveQrToHistory(user, formData.url, formData.logo, dataToSave);

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
      {showHeader && (
        <HeaderGroup
          tag="h1"
          header="Free QR Code Generator, No Login, No Expiration"
          subheading={"Generate static QR codes for URLs instantly. Download, print, and use them forever."}
        />
      )}
      <div className="flex flex-col gap-4 w-full items-center md:items-stretch md:justify-center md:flex-row">
        <Card width="2xl">
          <InputArea
            url={formData.url}
            name={formData.name}
            onUrlChange={(e) => setFormData({ ...formData, url: e.target.value })}
            onNameChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Radios
            label="Body Pattern"
            type="body"
            value={formData.style}
            onValueChange={(val) => setFormData({ ...formData, style: val })}
            values={bodyShapes}
            size="lg"
          />

          <Radios
            label="Body Color"
            type="color"
            value={formData.color}
            onValueChange={(val) => setFormData({ ...formData, color: val })}
            values={bodyColors}
            shape="circle"
          />
          <div className="w-full flex flex-col gap-6 md:flex-row">
            <Radios
              label="Eye Frame"
              type="frame"
              value={formData.eyeFrame}
              onValueChange={(val) => setFormData({ ...formData, eyeFrame: val })}
              values={frameShapes}
            />

            <Radios
              label="Eye Ball"
              type="ball"
              value={formData.eyeBall}
              onValueChange={(val) => setFormData({ ...formData, eyeBall: val })}
              values={ballhapes}
            />
          </div>

          <Radios
            label="Background Color"
            type="color"
            value={formData.bgColor}
            onValueChange={(val) => setFormData({ ...formData, bgColor: val })}
            values={bgColors}
            shape="circle"
          />

          <UploadLogo logo={formData.logo} setFormData={setFormData} handleImageUpload={handleImageUpload} />
        </Card>
        <Card width="sm">
          <div
            className="aspect-square flex items-center justify-center rounded-lg border border-border relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: formData.bgColor === "transparent" ? "#fff" : formData.bgColor }}
          >
            {!formData.url ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 backdrop-blur-[1px]">
                <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full border shadow-sm">
                  Enter URL to generate
                </span>
              </div>
            ) : null}

            {/* New SVG Renderer */}
            <div className="w-full h-full p-6">
              <QRCodeRenderer
                matrix={matrix}
                size={1000}
                dotType={formData.style}
                eyeFrame={formData.eyeFrame}
                eyeBall={formData.eyeBall}
                bodyColor={formData.color}
                eyeColor={formData.color}
                bgColor={formData.bgColor}
                logoUrl={formData.logo}
              />
            </div>
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
      </div>
      <AdSpace />
    </Section>
  );
}
