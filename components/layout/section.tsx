export default function Section({
  children,
  bg = "bg-background",
}: Readonly<{ children: React.ReactNode; bg?: string }>) {
  return <section className={`flex min-h-[80vh] items-center justify-center ${bg}`}>{children}</section>;
}
