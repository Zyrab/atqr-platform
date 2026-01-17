"use client";

import { useState, useEffect } from "react";
import { QrCode, LayoutDashboard, LogOut, Loader2, Sun, Moon } from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Import View Components
import LandingPage from "@/components/views/landing-page";
import Dashboard from "@/components/views/dashboard";
import QRBuilder from "@/components/views/qr-builder";
import Pricing from "@/components/views/pricing";
import AuthForm from "@/components/views/auth-form";
import Header from "@/components/layout/headet";

// Import UI Components
import { Button } from "@/components/ui/button";

export default function QRStudioApp() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState("landing");
  const [loading, setLoading] = useState(true);

  // New: State to hold the code data when clicking "Edit"
  const [editData, setEditData] = useState<any>(null);

  const [darkMode, setDarkMode] = useState(false);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && (view === "login" || view === "register")) {
        setView("dashboard");
      }
    });
    return () => unsubscribe();
  }, [view]);

  // 2. Theme Handling (DOM Manipulation)
  // This actually applies the class to <html> so Tailwind sees it
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      // Initialize state based on system preference if first load
      if (!darkMode && isSystemDark) {
        setDarkMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 3. Routing Handler
  // Allows views to change the screen AND pass data (like editData)
  const handleSetView = (newView: string, data?: any) => {
    setView(newView);
    // If we are going to 'create', we might be passing data to edit.
    // If we go anywhere else, reset the edit data.
    if (newView === "create" && data) {
      setEditData(data);
    } else {
      setEditData(null);
    }
  };

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard user={user} setView={handleSetView} />;
      case "create":
        // Pass editData as initialData to the builder
        return <QRBuilder user={user} setView={handleSetView} initialData={editData} />;
      case "pricing":
        return <Pricing user={user} setView={handleSetView} />;
      case "login":
        return <AuthForm mode="login" setView={handleSetView} />;
      case "register":
        return <AuthForm mode="register" setView={handleSetView} />;
      default:
        return <LandingPage setView={handleSetView} user={user} />;
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
      </div>
    );

  return (
    // We don't need the class here anymore, it's on <html>
    <div>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-200">
        <main className="flex-1">{renderView()}</main>

        <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 text-slate-400 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2024 QR Studio. Built for simplicity.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
