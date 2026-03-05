"use client";
import { useState, useContext, createContext, ReactNode } from "react";

interface NotifyContextType {
  notify: (text: string, type?: string) => void;
}

const NotifyContext = createContext<NotifyContextType>({
  notify: () => {},
});

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
  const [msg, setMsg] = useState<{ text: string; type: string } | null>(null);

  const notify = (text: string, type: string = "info") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      {msg && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded shadow-lg z-50 text-white ${
            msg.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {msg.text}
        </div>
      )}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => useContext(NotifyContext);
