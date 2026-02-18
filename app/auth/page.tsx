"use client";

import { useState, useEffect, Suspense } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, loginGoogle } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";
import GoogleIcon from "./google-icon";
import { useAuth } from "@/context/auth-context";
import Section from "@/components/layout/section";
import { Card } from "@/components/ui/card";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.message || "An error occurred";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setError("Google sign in failed");
    }
  };

  return (
    <Section>
      <Card>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {mode === "login" ? "Sign in" : "Create a free account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Only needed to save and manage QR codes."
              : "Save up to 10 static QR codes. No expiration."}
          </p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full flex gap-2" onClick={handleGoogleLogin}>
            <GoogleIcon /> Sign in with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputGroup
              label="Email"
              type="email"
              placeholder="name@example.com"
              startIcon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputGroup
              label="Password"
              type="password"
              placeholder="Password"
              startIcon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === "register" && (
              <InputGroup
                label="Confirm Password"
                type="password"
                placeholder="Password"
                startIcon={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          {mode === "login" ? (
            <p className="text-muted-foreground">
              Don't have an account?
              <Link href="/auth?mode=register">
                <Button variant="link">Create one for free</Button>
              </Link>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?
              <Link href="/auth?mode=login">
                <Button variant="link">Sign in</Button>
              </Link>
            </p>
          )}
        </div>
      </Card>
    </Section>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
