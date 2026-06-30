import type { ThemePreset, ThemePresetKey } from "@/types/commerce";

/**
 * Theme presets for the storefront. `silver-luxury` is the brand default:
 * a pearl-white base, charcoal text, and a champagne accent — the premium
 * silver-jewelry direction. Keep the keys in sync with `ThemePresetKey`.
 */
export const themePresets: Record<ThemePresetKey, ThemePreset> = {
  "silver-luxury": {
    key: "silver-luxury",
    name: "Silver Luxury",
    colors: {
      background: "#f8f8f6",
      foreground: "#1b1d22",
      primary: "#2b2f36",
      secondary: "#8b9099",
      accent: "#b99b62",
      muted: "#e9e9e5",
      border: "#d8d8d2",
    },
    fonts: {
      sans: '"Inter", system-ui, -apple-system, Segoe UI, sans-serif',
      serif: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
    },
  },
  "luxury-gold": {
    key: "luxury-gold",
    name: "Luxury Gold",
    colors: {
      background: "#fbfaf7",
      foreground: "#15120d",
      primary: "#9d7a2f",
      secondary: "#263238",
      accent: "#f2efe6",
      muted: "#e8e1d3",
      border: "#d6c8a9",
    },
    fonts: { sans: "system-ui, sans-serif", serif: "Georgia, serif" },
  },
  "minimal-modern": {
    key: "minimal-modern",
    name: "Minimal Modern",
    colors: {
      background: "#f7f8f5",
      foreground: "#17201b",
      primary: "#0f766e",
      secondary: "#1f2937",
      accent: "#b45309",
      muted: "#e5e7df",
      border: "#c9d1c7",
    },
    fonts: { sans: "system-ui, sans-serif", serif: "Georgia, serif" },
  },
  "dark-luxury": {
    key: "dark-luxury",
    name: "Dark Luxury",
    colors: {
      background: "#101214",
      foreground: "#f8fafc",
      primary: "#d4af37",
      secondary: "#38bdf8",
      accent: "#f472b6",
      muted: "#27272a",
      border: "#3f3f46",
    },
    fonts: { sans: "system-ui, sans-serif", serif: "Georgia, serif" },
  },
};

export const activeThemePreset = themePresets["silver-luxury"];
