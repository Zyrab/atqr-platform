import React from "react";
import {
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  LogIn,
  BadgePercent,
  MapPinPlus,
  Unlink2,
  Utensils,
  LucideProps,
  Link,
  Type,
  Wifi,
  KeyRound,
  CircleUser,
  CreditCard,
  UserPlus,
  BadgeCheck,
} from "lucide-react";

const ICON_MAP = {
  utensils: Utensils,
  unlink: Unlink2,
  discount: BadgePercent,
  alt_location: MapPinPlus,
  link: Link,
  type: Type,
  wifi: Wifi,
  key_round: KeyRound,
  sun: Sun,
  moon: Moon,
  dashboard: LayoutDashboard,
  log_out: LogOut,
  log_in: LogIn,
  user_plus: UserPlus,
  user: CircleUser,
  credit_card: CreditCard,
  badge_check: BadgeCheck,
} as const;

type IconName = keyof typeof ICON_MAP;

interface IconsProps extends LucideProps {
  name: IconName | string;
}

export default function Icons({ name, ...props }: IconsProps) {
  const IconComponent = ICON_MAP[name as IconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
}
