export type TextDirection = "ltr" | "rtl";

export type BusinessType =
  | "fashion"
  | "jewelry"
  | "perfume"
  | "kids"
  | "home-tools"
  | "beauty"
  | "accessories"
  | "handmade"
  | "home-decor"
  | "general-retail";

export type StoreConfig = {
  name: string;
  slogan: string;
  businessType: BusinessType;
  currency: string;
  locale: string;
  direction: TextDirection;
  logoPath: string;
  faviconPath: string;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    copy: string;
    imagePath: string;
  };
};

export type ThemePresetKey =
  | "silver-luxury"
  | "luxury-gold"
  | "minimal-modern"
  | "dark-luxury";

export type ThemePreset = {
  key: ThemePresetKey;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
  fonts: {
    sans: string;
    serif: string;
  };
};

export type FeatureFlags = {
  wishlist: boolean;
  customOrders: boolean;
  guestCheckout: boolean;
  orderTracking: boolean;
  liveChat: boolean;
};

export type NavigationItem = {
  label: string;
  key?: string;
  labelKey?: string;
  href: string;
  enabled?: boolean;
};

export type FooterSection = {
  title: string;
  titleKey: string;
  links: NavigationItem[];
};

export type SeoConfig = {
  title: string;
  description: string;
  keywords: string[];
  robots: string;
  openGraphImage: string;
};

export type IntegrationConfig = {
  liveChatScriptUrl?: string;
  analyticsMeasurementId?: string;
  courierTrackingBaseUrl?: string;
};

export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};
