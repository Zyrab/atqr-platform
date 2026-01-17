import { Image as ImageIcon, X, Loader2, Check, ArrowLeft, Settings2 } from "lucide-react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { User } from "firebase/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { saveQrToHistory, updateQrCode } from "@/lib/firebase";
import { generateQRCode, resizeImage, QRStyle, LogoStyle } from "@/lib/qr-utils";
import { useQRCodes } from "@/hooks/use-qr-codes";

interface QRBuilderProps {
  user: User | null;
  setView: (view: string) => void;
  initialData?: any;
}

interface FormData {
  url: string;
  name: string;
  color: string;
  logo: string | null;
  style: QRStyle;
  logoStyle: LogoStyle;
}

export default function QRBuilder({ user, setView, initialData }: QRBuilderProps) {
  const [formData, setFormData] = useState<FormData>({
    url: initialData?.text || "",
    name: initialData?.name || "",
    color: initialData?.color || "#000000",
    logo: initialData?.logoBase64 || null,
    style: initialData?.style || "square",
    logoStyle: initialData?.logoStyle || "square",
  });

  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { codes } = useQRCodes(user);

  useEffect(() => {
    if (canvasRef.current && formData.url) {
      generateQRCode(
        canvasRef.current,
        formData.url,
        {
          color: formData.color,
          style: formData.style,
          logoStyle: formData.logoStyle,
        },
        formData.logo
      );
    }
  }, [formData]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
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
    if (!user) return;

    if (!initialData && codes.length >= 10) {
      alert("Limit reached! Please upgrade to save more codes.");
      setView("pricing");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        color: formData.color,
        style: formData.style,
        logoStyle: formData.logoStyle,
        name: formData.name,
      };

      if (initialData?.id) {
        await updateQrCode(initialData.id, {
          text: formData.url,
          logoBase64: formData.logo,
          ...dataToSave,
        });
      } else {
        await saveQrToHistory(user, formData.url, formData.logo, dataToSave);
      }
      setView("dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="space-y-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("dashboard")}
              className="-ml-3 mb-2 text-slate-500 dark:text-slate-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {initialData ? "Edit QR Code" : "Create QR Code"}
            </h2>
          </div>

          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="space-y-4">
              <Input
                label="Website URL"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />

              <Input
                label="Name (Optional)"
                placeholder="Marketing Flyer..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Styling Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Design</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-9 w-full p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dots Style</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1 text-sm shadow-sm transition-colors"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value as QRStyle })}
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {formData.logo ? "Change Logo" : "Upload Logo"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>

                  {formData.logo && (
                    <select
                      className="w-32 flex h-9 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1 text-sm"
                      value={formData.logoStyle}
                      onChange={(e) => setFormData({ ...formData, logoStyle: e.target.value as LogoStyle })}
                    >
                      <option value="square">Square</option>
                      <option value="circle">Circle</option>
                      <option value="trace">Trace (New)</option>
                      <option value="none">No Back</option>
                    </select>
                  )}

                  {formData.logo && (
                    <button
                      onClick={() => setFormData({ ...formData, logo: null })}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-md transition-colors"
                      title="Remove Logo"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">Max 2MB. Transparent PNG recommended.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="md:sticky md:top-24 h-fit space-y-6">
          <div className="bg-slate-900 dark:bg-black rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden border border-slate-800">
            {/* Background Blob */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg relative z-10">
              <div className={`${!formData.url ? "hidden" : "block"}`}>
                {/* The canvas is drawn by the hook, we just provide the ref */}
                <canvas ref={canvasRef} className="w-full h-full max-w-[200px] max-h-[200px]" />
              </div>

              {!formData.url && (
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-300">Enter URL</div>
              )}
            </div>
          </div>

          <Button className="w-full h-12 text-lg" disabled={!formData.url || saving} onClick={handleSave}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
            {initialData ? "Update Code" : "Save Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
