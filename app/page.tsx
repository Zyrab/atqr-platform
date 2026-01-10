"use client";

import { useState, useEffect } from "react";
import { QrCode, LayoutDashboard, LogOut, Loader2, Sun, Moon } from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Using absolute import alias

// Import View Components
import LandingPage from "@/components/views/landing-page";
import Dashboard from "@/components/views/dashboard";
import QRBuilder from "@/components/views/qr-builder";
import Pricing from "@/components/views/pricing";
import AuthForm from "@/components/views/auth-form";

// Import UI Components
import Button from "@/components/ui/button";

export default function QRStudioApp() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Auth & Theme Init
  useEffect(() => {
    // 1. Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Redirect to dashboard if on auth pages and user is logged in
      if (currentUser && (view === "login" || view === "register")) {
        setView("dashboard");
      }
    });

    // 2. Theme Init (Check system pref)
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }

    return () => unsubscribe();
  }, []);

  // View Routing
  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard user={user} setView={setView} />;
      case "create":
        return <QRBuilder user={user} setView={setView} />;
      case "pricing":
        return <Pricing user={user} setView={setView} />;
      case "login":
        return <AuthForm mode="login" setView={setView} />;
      case "register":
        return <AuthForm mode="register" setView={setView} />;
      default:
        return <LandingPage setView={setView} user={user} />;
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
      </div>
    );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-200">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setView(user ? "dashboard" : "landing")}
            >
              {/* Brand Logo with Accent */}
              <div className="bg-slate-900 dark:bg-teal-600 text-white p-1 rounded transition-colors duration-300">
                <QrCode size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                QR Studio
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setView("dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => signOut(auth)}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setView("login")}>
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => setView("register")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{renderView()}</main>

        {/* Footer */}
        <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 text-slate-400 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2024 QR Studio. Built for simplicity.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
