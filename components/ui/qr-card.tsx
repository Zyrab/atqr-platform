import { useEffect, useRef, useState } from "react";
import { Download, Trash2, Calendar, FileImage, FileCode } from "lucide-react";
import { generateQRCode, downloadAsPNG, downloadAsSVG, QRCodeOptions } from "@/lib/qr-utils";

interface QRCardProps {
  id: string;
  text: string;
  logoBase64?: string | null;
  color?: string;
  // New props for styling (optional for backward compatibility)
  style?: QRCodeOptions["style"];
  logoStyle?: QRCodeOptions["logoStyle"];
  createdAt?: string;
  onDelete: (id: string) => void;
}

export default function QRCard({
  id,
  text,
  logoBase64,
  color = "#000000",
  style = "square",
  logoStyle = "square",
  createdAt,
  onDelete,
}: QRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      // Pass the style options to our new generator
      generateQRCode(canvasRef.current, text, { color, style, logoStyle }, logoBase64);
    }
  }, [text, logoBase64, color, style, logoStyle]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Unknown date";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group relative">
      <div className="p-4 flex gap-4 items-start">
        <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-200 p-2">
          {/* Canvas size is controlled by CSS, internal resolution by the generator */}
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-between h-24">
          <div>
            <h4 className="font-medium truncate text-slate-900 dark:text-white text-base" title={text}>
              {text}
            </h4>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Static
            </span>
            {style !== "square" && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded">
                {style}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Download Options Overlay */}
      {showDownloadOptions && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-10 flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-200">
          <p className="text-sm font-semibold mb-1">Select Format</p>
          <button
            onClick={() => {
              downloadAsPNG(canvasRef.current);
              setShowDownloadOptions(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 w-40 justify-center text-sm transition-colors"
          >
            <FileImage size={14} /> PNG (High Res)
          </button>
          <button
            onClick={() => {
              downloadAsSVG(text, color);
              setShowDownloadOptions(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 w-40 justify-center text-sm transition-colors"
          >
            <FileCode size={14} /> SVG (Vector)
          </button>
          <button
            onClick={() => setShowDownloadOptions(false)}
            className="text-xs text-slate-400 hover:text-slate-600 mt-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex justify-between items-center opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
        <button
          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          onClick={() => onDelete(id)}
        >
          <Trash2 size={14} />
          Delete
        </button>

        <button
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          onClick={() => setShowDownloadOptions(true)}
        >
          <Download size={14} />
          Download
        </button>
      </div>
    </div>
  );
}
