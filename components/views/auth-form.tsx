import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { auth, loginGoogle } from "../../lib/firebase";

interface AuthFormProps {
  mode: "login" | "register";
  setView: (view: string) => void;
}

export default function AuthForm({ mode, setView }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setView("dashboard");
    } catch (err: any) {
      // Extract the error message safely
      const message = err.message || "An error occurred";
      setError(message.replace("Firebase: ", ""));
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginGoogle();
      setView("dashboard");
    } catch (err: any) {
      const message = err.message || "Google sign in failed";
      setError(message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter your email below to continue</p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full relative flex items-center gap-2"
            onClick={handleGoogleLogin}
          >
            {/* Simple Google SVG Icon */}
            <svg
              className="h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 dark:bg-slate-950 px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <Button type="submit" className="w-full">
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="underline text-teal-600 dark:text-teal-400 hover:text-teal-700"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="underline text-teal-600 dark:text-teal-400 hover:text-teal-700"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
