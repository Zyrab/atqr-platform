import { Zap, Loader2, QrCode } from "lucide-react";
import { useState } from "react";
import { User } from "firebase/auth";
import Button from "../ui/button";
import QRCard from "../ui/qr-card";
import { useQRCodes } from "@/hooks/use-qr-codes";

interface DashboardProps {
  user: User | null;
  setView: (view: string) => void;
}

export default function Dashboard({ user, setView }: DashboardProps) {
  // Use our custom hook for all data logic
  const { codes, loading, removeCode } = useQRCodes(user);

  // We'll keep the plan/credits logic simple for now
  const [userData] = useState({ credits: 10, plan: "free" });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Codes</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your saved QR codes.</p>
        </div>
        <div className="flex md:justify-end gap-3">
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${userData.plan === "pro" ? "bg-teal-500" : "bg-slate-300"}`} />
            <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
              {userData.plan} Plan
            </span>
          </div>
          <Button onClick={() => setView("create")}>
            <Zap className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>
      </div>

      {/* Usage Meter */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-2 transition-colors">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Free Codes Used</span>
          <span className="text-slate-500 dark:text-slate-400">{codes.length} / 10</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-500"
            style={{ width: `${Math.min((codes.length / 10) * 100, 100)}%` }}
          />
        </div>
        {codes.length >= 10 && userData.plan === "free" && (
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs px-3 py-2 rounded mt-2">
            <span>Limit reached. Upgrade to generate more.</span>
            <span className="font-bold cursor-pointer underline" onClick={() => setView("pricing")}>
              Upgrade
            </span>
          </div>
        )}
      </div>

      {/* Code Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-teal-600" />
        </div>
      ) : codes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <QrCode className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="font-medium text-slate-900 dark:text-white">No codes yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first QR code to save it here.</p>
          <Button onClick={() => setView("create")}>Create QR Code</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codes.map((code) => (
            <QRCard
              key={code.id}
              id={code.id}
              text={code.text}
              logoBase64={code.logoBase64}
              color={code.color}
              createdAt={code.createdAt}
              onDelete={removeCode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
