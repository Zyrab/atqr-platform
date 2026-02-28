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
  QrCode,
  Palette,
  Image,
  Download,
  Edit,
  Loader2,
  Save,
  Upload,
  X,
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
  qr_code: QrCode,
  palette: Palette,
  image: Image,
  edit: Edit,
  download: Download,
  loader_2: Loader2,
  save: Save,
  upload: Upload,
  x: X,
} as const;

type IconName = keyof typeof ICON_MAP;

interface IconsProps extends LucideProps {
  name: IconName | string;
}

export default function Icons({ name, ...props }: IconsProps) {
  const IconComponent = ICON_MAP[name as IconName];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
}
