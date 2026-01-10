import { useEffect, useRef } from "react";
import { Download, Trash2, Calendar } from "lucide-react";
import { generateQRCode, downloadCanvas } from "@/lib/qr-utils";

interface QRCardProps {
  id: string;
  text: string;
  logoBase64?: string | null;
  color?: string; // Optional, defaults to black if not saved
  createdAt?: string;
  onDelete: (id: string) => void;
}

export default function QRCard({ id, text, logoBase64, color = "#000000", createdAt, onDelete }: QRCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate the visual preview when the card loads
  useEffect(() => {
    if (canvasRef.current) {
      // Use the shared utility to ensure it looks exactly like the builder
      generateQRCode(canvasRef.current, text, color, logoBase64);
    }
  }, [text, logoBase64, color]);

  // Format date nicely
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Unknown date";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      <div className="p-4 flex gap-4 items-start">
        <div className="w-24 h-24 bg-white rounded-lg shrink-0 flex items-center justify-center border border-slate-200 p-2">
          <canvas ref={canvasRef} className="w-full h-full object-contain" width={300} height={300} />
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
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          onClick={() => onDelete(id)}
        >
          <Trash2 size={14} />
          Delete
        </button>

        <button
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          onClick={() => downloadCanvas(canvasRef.current)}
        >
          <Download size={14} />
          Download PNG
        </button>
      </div>
    </div>
  );
}
