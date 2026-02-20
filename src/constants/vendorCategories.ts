export const VENDOR_CATEGORIES = [
  "buffet",
  "cerimonia",
  "decoracao",
  "fotografia",
  "musica",
  "bolo",
  "outros",
] as const;

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];
