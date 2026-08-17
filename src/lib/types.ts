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
  /** Giá gốc trước khuyến mãi — hiển thị gạch ngang khi lớn hơn `price`. */
  compare_at_price?: number | null;
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
  compare_at_price?: number | null;
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
  discount_code?: string | null;
  discount_amount?: number;
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

/** Màu nền pastel riêng cho từng nhóm ngành — dùng làm nền ảnh sản phẩm khi
 * chưa có ảnh chụp thật, tạo cảm giác đa dạng như card mockup. */
export const CATEGORY_BG: Record<ProductCategory, string> = {
  "personal-finance": "bg-emerald-50",
  "accounting-b2b": "bg-amber-50",
  "project-management": "bg-indigo-50",
  "hr-operations": "bg-sky-50",
  "marketing-sales": "bg-rose-50",
  "real-estate": "bg-orange-50",
  ecommerce: "bg-violet-50",
  "event-wedding": "bg-pink-50",
  "education-coaching": "bg-teal-50",
  "fitness-health": "bg-lime-50",
};

const CATEGORY_LABELS_EN: Record<ProductCategory, string> = {
  "personal-finance": "Personal Finance",
  "accounting-b2b": "Accounting (B2B)",
  "project-management": "Project Management",
  "hr-operations": "HR & Operations",
  "marketing-sales": "Marketing & Sales",
  "real-estate": "Real Estate",
  ecommerce: "E-commerce",
  "event-wedding": "Events & Weddings",
  "education-coaching": "Education & Coaching",
  "fitness-health": "Fitness & Health",
};

const CATEGORY_LABELS_ZH: Record<ProductCategory, string> = {
  "personal-finance": "个人财务",
  "accounting-b2b": "企业会计（B2B）",
  "project-management": "项目管理",
  "hr-operations": "人力资源与运营",
  "marketing-sales": "市场与销售",
  "real-estate": "房地产",
  ecommerce: "电子商务",
  "event-wedding": "活动与婚礼",
  "education-coaching": "教育与培训",
  "fitness-health": "健康与健身",
};

/** Nhãn nhóm ngành theo locale — 'vi' dùng CATEGORY_LABELS mặc định. */
export function getCategoryLabel(category: ProductCategory, locale: "vi" | "en" | "zh"): string {
  if (locale === "en") return CATEGORY_LABELS_EN[category];
  if (locale === "zh") return CATEGORY_LABELS_ZH[category];
  return CATEGORY_LABELS[category];
}

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
