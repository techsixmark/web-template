/**
 * Helper cho luồng thanh toán VietQR + đối soát tự động qua SePay.
 *
 * - Ảnh QR được sinh trực tiếp qua VietQR image API (img.vietqr.io), không
 *   cần gọi SePay để tạo QR.
 * - SePay chỉ dùng để bắn webhook khi phát hiện giao dịch vào tài khoản
 *   ngân hàng đã đăng ký — xem route `src/app/api/webhook/sepay/route.ts`.
 */

const BANK_NAME_CODE = process.env.BANK_NAME_CODE!; // vd: "MBBank", "VCB", "ACB"...
const BANK_ACCOUNT_NUMBER = process.env.BANK_ACCOUNT_NUMBER!;
const BANK_ACCOUNT_NAME = process.env.BANK_ACCOUNT_NAME!;

/** Sinh mã đơn hàng ngắn, duy nhất, dùng làm nội dung chuyển khoản. */
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm (0/O, 1/I)
  let code = "DH";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * URL ảnh QR VietQR động cho một đơn hàng cụ thể. Nội dung chuyển khoản
 * chính là `orderCode` — dùng để đối chiếu ở webhook.
 */
export function getVietQrImageUrl(params: {
  amount: number;
  orderCode: string;
}): string {
  const { amount, orderCode } = params;
  const url = new URL(
    `https://img.vietqr.io/image/${BANK_NAME_CODE}-${BANK_ACCOUNT_NUMBER}-compact2.png`
  );
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("addInfo", orderCode);
  url.searchParams.set("accountName", BANK_ACCOUNT_NAME);
  return url.toString();
}

/**
 * Xác thực request webhook thực sự đến từ SePay bằng API key đã cấu hình
 * trong dashboard SePay (header: `Authorization: Apikey <key>`).
 */
export function verifySePayWebhook(authorizationHeader: string | null): boolean {
  const expected = process.env.SEPAY_WEBHOOK_API_KEY;
  if (!expected || !authorizationHeader) return false;
  return authorizationHeader === `Apikey ${expected}`;
}

/** Trích order_code (dạng DHXXXXXX) từ nội dung chuyển khoản SePay trả về. */
export function extractOrderCode(transactionContent: string): string | null {
  const match = transactionContent.toUpperCase().match(/DH[A-Z0-9]{6}/);
  return match ? match[0] : null;
}
