import { Image as ImageIcon, X, Loader2, Check } from "lucide-react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { User } from "firebase/auth";
import Button from "../ui/button";
import Input from "../ui/input";
import { saveQrToHistory } from "@/lib/firebase";
import { generateQRCode, resizeImage } from "@/lib/qr-utils";
import { useQRCodes } from "@/hooks/use-qr-codes";

interface QRBuilderProps {
  user: User | null;
  setView: (view: string) => void;
}

interface FormData {
  url: string;
  name: string;
  color: string;
  logo: string | null;
}

export default function QRBuilder({ user, setView }: QRBuilderProps) {
  const [formData, setFormData] = useState<FormData>({
    url: "",
    name: "",
    color: "#000000",
    logo: null,
  });
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reuse the hook to check the user's current code count
  const { codes } = useQRCodes(user);
  const codeCount = codes.length;

  // 1. Generate QR Code on canvas whenever data changes
  useEffect(() => {
    if (canvasRef.current && formData.url) {
      generateQRCode(canvasRef.current, formData.url, formData.color, formData.logo);
    }
  }, [formData]);

  // 2. Updated Image Upload Logic
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        // 2MB limit
        alert("File too large. Please upload an image under 2MB.");
        return;
      }

      try {
        const resizedBase64 = await resizeImage(file);
        setFormData((prev) => ({ ...prev, logo: resizedBase64 }));
      } catch (err) {
        console.error("Error resizing image:", err);
        alert("Failed to process image.");
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (codeCount >= 10) {
      alert("Limit reached! Please upgrade to save more codes.");
      setView("pricing");
      return;
    }

    setSaving(true);
    try {
      // Use the centralized save function
      await saveQrToHistory(user, formData.url, formData.logo);
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
              ← Back to Dashboard
            </Button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create QR Code</h2>
          </div>

          <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <Input
              label="Website URL"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />

            <Input
              label="Name (for your reference)"
              placeholder="My Portfolio, Marketing Flyer..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-20 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">{formData.color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo / Icon (Center)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                  <ImageIcon className="mr-2 h-4 w-4" /> Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {formData.logo && (
                  <div className="relative">
                    <img
                      src={formData.logo}
                      className="w-10 h-10 object-cover rounded border border-slate-200 dark:border-slate-700"
                      alt="Logo preview"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, logo: null })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Max 100KB. Transparent PNG recommended.</p>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="md:sticky md:top-24 h-fit space-y-6">
          <div className="bg-slate-900 dark:bg-black rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden border border-slate-800">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg relative z-10">
              {/* Canvas Preview Area */}
              <div className={`${!formData.url ? "hidden" : "block"}`}>
                <canvas ref={canvasRef} className="w-full h-full max-w-[200px] max-h-[200px]" />
              </div>

              {!formData.url && (
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-300">Enter URL</div>
              )}
            </div>
          </div>

          <Button className="w-full h-12 text-lg" disabled={!formData.url || saving} onClick={handleSave}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
            Save Code
          </Button>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">{codeCount} / 10 Free codes used</p>
        </div>
      </div>
    </div>
  );
}
