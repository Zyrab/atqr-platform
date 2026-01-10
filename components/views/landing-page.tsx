import { useState } from "react";
import { QrCode, Download } from "lucide-react";
import { User } from "firebase/auth";
import AdSpace from "../ui/ad-space";
import Button from "../ui/button";
import Input from "../ui/input";

interface LandingPageProps {
  setView: (view: string) => void;
  user: User | null;
}

export default function LandingPage({ setView, user }: LandingPageProps) {
  const [url, setUrl] = useState("");

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center space-y-8 bg-white dark:bg-slate-950 transition-colors">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create QR Codes <span className="text-teal-600 dark:text-teal-400">Instantly</span>.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Free static QR codes forever. No sign-up required. Upgrade for dynamic tracking and custom designs.
          </p>
        </div>

        <AdSpace className="w-full max-w-182 h-22.5 hidden md:flex" />

        {/* The "Lite" Generator */}
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-6 space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter your website URL</label>
              <Input placeholder="https://yourwebsite.com" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>

            <div className="flex justify-center bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              {/* We keep a white background behind the QR code image even in dark mode for scannability */}
              <div className="bg-white p-2 rounded">
                {url ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
                    alt="QR Preview"
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-slate-300">
                    <QrCode className="w-16 h-16 opacity-20" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                disabled={!url}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(
                    url
                  )}`;
                  link.target = "_blank";
                  link.download = "qrcode.png";
                  link.click();
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>

              {!user ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Want to save this code?{" "}
                  <button
                    className="text-teal-600 dark:text-teal-400 cursor-pointer underline hover:text-teal-700 bg-transparent border-none p-0 inline"
                    onClick={() => setView("register")}
                  >
                    Create a free account
                  </button>
                </p>
              ) : (
                <Button variant="secondary" className="w-full" onClick={() => setView("create")}>
                  Go to Dashboard to Save
                </Button>
              )}
            </div>
          </div>
        </div>

        <AdSpace className="w-full max-w-75 h-62.5 md:hidden" format="square" />
      </div>

      {/* SEO Section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-16 px-4 transition-colors">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Expiration</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Static QR codes generated here work forever. We don't redirect your traffic through our servers unless
                you choose Dynamic codes.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">High Resolution</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Download print-quality PNGs suitable for flyers, business cards, and billboards.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pro Features</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sign up to add your logo, change colors, and track scan analytics with our Pro plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
