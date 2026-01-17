"use client";
import { logoutUser } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { QrCode, Sun, Moon, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from system/local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // You could also check localStorage here
      if (isSystemDark) {
        setDarkMode(true);
      }
    }
  }, []);

  // Apply theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-muted/95 backdrop-blur supports-backdrop-filter:bg-muted/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-primary text-primary-foreground p-1 transition-colors duration-300 group-hover:bg-primary/90">
            <QrCode size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground transition-colors group-hover:text-primary">
            True QR
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="w-9 px-0">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut />
                Log Out
              </Button>
              <Link href="/dashboard">
                <Button size="sm">
                  <LayoutDashboard />
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth?mode=login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
