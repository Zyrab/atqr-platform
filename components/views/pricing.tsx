import { Check, X } from "lucide-react";
import { User } from "firebase/auth";
import { Button } from "../ui/button";

interface PricingProps {
  user: User | null;
  setView: (view: string) => void;
}

export default function Pricing({ user, setView }: PricingProps) {
  const handlePurchase = (plan: string) => {
    const btn = document.getElementById(`btn-${plan}`);
    if (btn) btn.innerText = "Processing...";

    setTimeout(() => {
      alert(`Redirecting to Stripe Checkout for ${plan}... (Mock Success)`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
      <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Upgrade your Workspace</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-12">Choose a plan that fits your needs.</p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Expensive One-Time Option */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all relative">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter Refill</h3>
          <div className="my-4 text-slate-900 dark:text-white">
            <span className="text-4xl font-extrabold">$15</span>
            <span className="text-slate-500 dark:text-slate-400"> / one-time</span>
          </div>
          <ul className="text-left space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex gap-2">
              <Check size={16} className="text-green-500" /> +10 Static QR Codes
            </li>
            <li className="flex gap-2">
              <Check size={16} className="text-green-500" /> No Monthly Fees
            </li>
            <li className="flex gap-2">
              <X size={16} className="text-slate-300 dark:text-slate-600" /> No Dynamic Links
            </li>
          </ul>
          <Button id="btn-refill" variant="outline" className="w-full" onClick={() => handlePurchase("refill")}>
            Buy Refill
          </Button>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">$1.50 per code</p>
        </div>

        {/* Attractive Subscription Option */}
        <div className="bg-slate-900 dark:bg-black text-white border-slate-900 dark:border-slate-800 border rounded-2xl p-8 shadow-xl relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
            Best Value
          </div>
          <h3 className="text-xl font-bold">Pro Membership</h3>
          <div className="my-4">
            <span className="text-4xl font-extrabold">$9</span>
            <span className="text-slate-400"> / month</span>
          </div>
          <ul className="text-left space-y-3 mb-8 text-sm text-slate-300">
            <li className="flex gap-2">
              <Check size={16} className="text-teal-400" /> Unlimited Static Codes
            </li>
            <li className="flex gap-2">
              <Check size={16} className="text-teal-400" /> 10 Dynamic Links / mo
            </li>
            <li className="flex gap-2">
              <Check size={16} className="text-teal-400" /> Advanced Analytics
            </li>
            <li className="flex gap-2">
              <Check size={16} className="text-teal-400" /> Priority Support
            </li>
          </ul>
          <Button
            id="btn-sub"
            className="w-full bg-teal-600 hover:bg-teal-700 border-none text-white shadow-lg shadow-teal-900/20"
            onClick={() => handlePurchase("subscription")}
          >
            Start Free Trial
          </Button>
          <p className="text-[10px] text-slate-500 mt-2">Cancel anytime.</p>
        </div>
      </div>

      <Button variant="ghost" className="mt-12" onClick={() => setView("dashboard")}>
        Maybe later
      </Button>
    </div>
  );
}
