export type ProductListItem = {
  id: number;
  name: string;
  name_en?: string | null;
  name_ar?: string | null;
  slug: string;
  price: number;
  currency: string;
  weight_in_grams?: number;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  category?: string | { id?: number; name: string; name_en?: string | null; name_ar?: string | null; slug?: string } | null;
  silver_type?: string | { id?: number; name: string; name_en?: string | null; name_ar?: string | null; slug?: string; purity?: string | null } | null;
  image?: string | null;
};

export type ProductVariant = {
  id: number;
  type: string;
  label: string;
  value?: string | null;
  price_adjustment: number;
};

export type ProductImage = {
  id: number;
  url: string;
  alt?: string | null;
  is_main: boolean;
};

export type ProductDetail = {
  id: number;
  name: string;
  name_en?: string | null;
  name_ar?: string | null;
  slug: string;
  sku?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  care_instructions?: string | null;
  care_instructions_en?: string | null;
  care_instructions_ar?: string | null;
  price: number;
  currency: string;
  weight_in_grams?: number | null;
  workmanship_fee?: number;
  stock_quantity: number;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  tags: string[];
  category?: { id: number; name: string; name_en?: string | null; name_ar?: string | null; slug: string } | null;
  silver_type?: { id: number; name: string; name_en?: string | null; name_ar?: string | null; purity?: string | null } | null;
  images: ProductImage[];
  main_image?: string | null;
  variants: ProductVariant[];
};

export type Category = {
  id: number;
  name: string;
  name_en?: string | null;
  name_ar?: string | null;
  slug: string;
  description?: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  image?: string | null;
  products_count?: number;
};

export type PaginatedMeta = {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};
