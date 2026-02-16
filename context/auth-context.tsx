"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, getUserDoc } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

import { UserData } from "@/types/user-data";
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const fetchUserData = async (uid: string, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    const data = await getUserDoc(uid);
    if (data) return data;
    await new Promise((res) => setTimeout(res, 500));
  }
  return null;
};

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      const data = await fetchUserData(firebaseUser.uid);
      setUserData(data);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {!loading ? (
        children
      ) : (
        <div className="h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
