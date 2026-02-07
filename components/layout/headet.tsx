"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Icons from "../elements/icons";
import LogoIcon from "./logo";

import { logoutUser } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { getLocale } from "@/content/getLocale";

export default function Header({ locale = "en" }: { locale?: "en" | "ka" }) {
  const t = getLocale(locale, "header");
  const { user } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSavedTheme = localStorage.getItem("saved_theme");
      if (isSavedTheme) {
        setDarkMode(isSavedTheme === "dark");
        document.documentElement.classList.add(isSavedTheme);
      } else {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isSystemDark) {
          setDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      }
    }
  }, []);

  const handleThemeToggle = () => {
    const isDark = !darkMode;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkMode(isDark);
    localStorage.setItem("saved_theme", isDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-muted/95 backdrop-blur supports-backdrop-filter:bg-muted/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-primary text-primary-foreground p-0.5 transition-colors duration-300 group-hover:bg-primary/80">
            <LogoIcon size={36} />
          </div>
          <div className="flex flex-col ">
            <span className="font-extrabold text-xl tracking-tight text-foreground transition-colors group-hover:text-primary">
              {t.title}
            </span>
            <span className="text-xs font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
              {t.subtitle}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleThemeToggle} className="w-9 px-0">
            {darkMode ? <Icons name="sun" size={20} /> : <Icons name="moon" size={20} />}
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Icons name="log_out" />
                <span className="hidden md:block">{t.log_out}</span>
              </Button>
              <Link href="/dashboard">
                <Button size="sm">
                  <Icons name="dashboard" />
                  <span className="hidden md:block">{t.dashboard}</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth?mode=login">
                <Button variant="ghost" size="sm">
                  {t.log_in}
                </Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button size="sm">{t.sign_up}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
