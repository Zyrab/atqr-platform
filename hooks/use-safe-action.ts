import { useState } from "react";
import { useNotify } from "@/context/notify-context";
import { useAuth } from "@/context/auth-context";

interface ActionOptions {
  successMsg?: string;
  onError?: (err: any) => void;
  onSuccess?: (result:any) => void;
  requireAuth?: boolean
}

export function useSafeAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotify();
  const {user} = useAuth()

  const runAction = async <T,>(actionFn: () => Promise<T>, options?: ActionOptions): Promise<T | undefined> => {
    if (options?.requireAuth && !user) {
      const msg = "You must be signed in to perform this action.";
      notify(msg, "error");
      setError(msg);
      return; 
    }    
    
    setLoading(true);
    setError(null);
    try {
      const result = await actionFn();
      if (options?.successMsg) notify(options.successMsg, "success");
      if (options?.onSuccess) options.onSuccess(result); 
      return result;
    } catch (err: any) {
      const message = err.message || "An error occurred";
      setError(message);
      notify(message, "error");
      if (options?.onError) options.onError(err);
      else  throw err;    
    } finally {
      setLoading(false);
    }
  };

  return { runAction, loading, error };
}