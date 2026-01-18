import { cn } from "@/lib/utils";

interface HeaderGroupProps {
  header: React.ReactNode;
  tag?: "h1" | "h2" | "h3" | "h4";
  subheading?: string | string[];
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function HeaderGroup({
  header,
  tag: Tag = "h2",
  subheading,
  children,
  className,
  headerClassName,
  size = "lg",
}: HeaderGroupProps) {
  const sizes = {
    xs: {
      header: "text-sm font-semibold",
      sub: "text-xs",
    },
    sm: {
      header: "text-base font-semibold",
      sub: "text-sm",
    },
    md: {
      header: "text-lg font-bold",
      sub: "text-base",
    },
    lg: {
      header: "text-2xl font-bold tracking-tight",
      sub: "text-md",
    },
  };

  const { header: headerSize, sub: subSize } = sizes[size];

  return (
    <div className={cn("space-y-2 max-w-240 flex flex-col items-center text-center", className)}>
      <Tag className={cn(headerSize, "text-foreground", headerClassName)}>{header}</Tag>

      {subheading && (
        <div className={cn("text-foreground space-y-2", subSize)}>
          {Array.isArray(subheading) ? subheading.map((line, i) => <p key={i}>{line}</p>) : <p>{subheading}</p>}
        </div>
      )}

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
