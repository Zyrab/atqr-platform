interface AdSpaceProps {
  className?: string;
  format?: "horizontal" | "square";
}

export default function AdSpace({ className, format = "horizontal" }: AdSpaceProps) {
  return (
    <div
      className={`bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-mono uppercase tracking-widest ${className}`}
    >
      {format === "horizontal" ? "AdSense Banner (728x90)" : "AdSense Square (300x250)"}
    </div>
  );
}
