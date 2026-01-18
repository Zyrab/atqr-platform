import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Header from "@/components/layout/headet";
const fontSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "QR Studio",
  description: "Free QR Code Generator",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <Header />
          <main className="flex flex-col min-h-[80vh] mt-12 gap-24">{children}</main>

          <footer className="bg-muted/30 border-t border-border py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">© 2024 QR Studio. Built for simplicity.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
