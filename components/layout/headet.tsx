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
import { actions } from "@/lib/actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";

export default function Header({ locale = "en" }: { locale?: "en" | "ka" }) {
  const t = getLocale(locale, "header");
  const { user, userData } = useAuth();
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
            <span className="font-extrabold text-xl tracking-tight text-foreground transition-colors group-hover:text-muted-foreground">
              {t.title}
            </span>
            <span className="text-xs font-medium tracking-tight text-foreground transition-colors group-hover:text-muted-foreground">
              {t.subtitle}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleThemeToggle} className="">
            {darkMode ? <Icons name="sun" size={20} /> : <Icons name="moon" size={20} />}
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <Icons name="dashboard" />
                  <span className="hidden md:block">{t.dashboard}</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Icons name="user" size="38" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{userData?.email}</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => router.push("/pricing")}>
                      <Icons
                        name="badge_check"
                        color={userData?.plan === "paid" ? "green" : userData?.plan === "trial" ? "#8D3BF8" : undefined}
                      />
                      {userData?.plan?.toUpperCase()}
                    </DropdownMenuItem>
                    {userData?.plan === "paid" && (
                      <DropdownMenuItem onSelect={() => actions.manage_subscription({})}>
                        <Icons name="credit_card" />
                        {t.manage_subs}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                      <Icons name="log_out" />
                      {t.log_out}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth?mode=login">
                  <Icons name="log_in" />
                  <span className="hidden md:block">{t.log_in}</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth?mode=register">
                  <Icons name="user_plus" />
                  <span className="hidden md:block">{t.sign_up}</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
