import { Timestamp } from "firebase/firestore";

export interface UserData {
  email: string | null;
  plan: "free" | "pro";
  qrLimit: number | null; // null = unlimited
  subscriptionStatus: "inactive" | "active" | "canceled" | "test";
  stripeCustomerId: string | null;
  paidUntil: Timestamp | null;
  createdAt: Timestamp;
}
