export type ProductCategory =
  | "personal-finance"
  | "accounting-b2b"
  | "project-management"
  | "hr-operations"
  | "marketing-sales"
  | "real-estate"
  | "ecommerce"
  | "event-wedding"
  | "education-coaching"
  | "fitness-health";

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
  /** Ghi chú chiến lược khai thác (nội bộ, không hiển thị cho khách). */
  monetization_strategy?: string | null;
  /** Sản phẩm liên quan — dùng cho cặp Basic (miễn phí) ↔ Pro (trả phí). */
  related_product_id?: string | null;
  /** Link video hướng dẫn (YouTube/Vimeo/mp4 trực tiếp). */
  video_url?: string | null;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  product_ids: string[];
  preview_images: string[];
  is_active: boolean;
  monetization_strategy?: string | null;
  created_at: string;
}

export type OrderStatus = "pending" | "paid" | "expired" | "cancelled";

export interface Order {
  id: string;
  order_code: string;
  product_id: string | null;
  bundle_id: string | null;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: OrderStatus;
  affiliate_code: string | null;
  created_at: string;
  paid_at: string | null;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "personal-finance": "Tài chính Cá nhân",
  "accounting-b2b": "Kế toán Doanh nghiệp (B2B)",
  "project-management": "Quản lý Dự án",
  "hr-operations": "Quản trị Nhân sự & Vận hành",
  "marketing-sales": "Marketing & Sales",
  "real-estate": "Bất động sản",
  ecommerce: "Thương mại điện tử",
  "event-wedding": "Tổ chức Sự kiện",
  "education-coaching": "Giáo dục & Huấn luyện",
  "fitness-health": "Sức khỏe & Thể hình",
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  "personal-finance": "💰",
  "accounting-b2b": "🧾",
  "project-management": "📊",
  "hr-operations": "🗂️",
  "marketing-sales": "📈",
  "real-estate": "🏠",
  ecommerce: "🛒",
  "event-wedding": "💍",
  "education-coaching": "🎓",
  "fitness-health": "🏋️",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "personal-finance",
  "accounting-b2b",
  "project-management",
  "hr-operations",
  "marketing-sales",
  "real-estate",
  "ecommerce",
  "event-wedding",
  "education-coaching",
  "fitness-health",
];

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " đ";
}
