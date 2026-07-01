import {
  BadgeCheck,
  Gem,
  MessageCircle,
  PencilRuler,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Maps homepageData icon keys to lucide components. */
export const iconMap: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  gem: Gem,
  "pencil-ruler": PencilRuler,
  "message-circle": MessageCircle,
  sparkles: Sparkles,
  truck: Truck,
  wallet: Wallet,
  "receipt-text": ReceiptText,
  "badge-check": BadgeCheck,
};
