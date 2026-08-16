export type ProductCategory =
  | "canva"
  | "figma"
  | "powerpoint"
  | "word"
  | "excel";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number; // VNĐ
  preview_images: string[];
  file_path: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "paid" | "expired" | "cancelled";

export interface Order {
  id: string;
  order_code: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
  paid_at: string | null;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  canva: "Canva",
  figma: "Figma",
  powerpoint: "PowerPoint",
  word: "Word",
  excel: "Excel",
};

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " đ";
}
