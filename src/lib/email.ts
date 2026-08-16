import { Resend } from "resend";

// Khởi tạo lazy để tránh lỗi lúc build/collect page data khi biến môi trường
// RESEND_API_KEY chưa được cấu hình (vd môi trường dev/preview mới).
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Thiếu RESEND_API_KEY trong biến môi trường");
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface DownloadEmailItem {
  productName: string;
  downloadUrl: string;
}

/**
 * Gửi email kèm link tải sau khi đơn được xác nhận (mua trả phí, freemium
 * hay combo/bundle đều dùng chung — `items` có thể gồm 1 hoặc nhiều file).
 */
export async function sendDownloadEmail(params: {
  to: string;
  customerName: string;
  orderLabel: string; // tên sản phẩm/bundle hiển thị ở tiêu đề email
  items: DownloadEmailItem[];
  expiresAt: Date;
  isFree?: boolean;
}) {
  const { to, customerName, orderLabel, items, expiresAt, isFree } = params;
  const expiresText = expiresAt.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const EMAIL_FROM = process.env.EMAIL_FROM!;

  const linksHtml = items
    .map(
      (item) => `
      <p style="margin:8px 0">
        <a href="${item.downloadUrl}" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px">
          Tải "${item.productName}"
        </a>
      </p>`
    )
    .join("");

  const intro = isFree
    ? `Cảm ơn bạn đã đăng ký nhận <strong>${orderLabel}</strong>.`
    : `Cảm ơn bạn đã mua <strong>${orderLabel}</strong>. Thanh toán của bạn đã được xác nhận thành công.`;

  return getResendClient().emails.send({
    from: EMAIL_FROM,
    to,
    subject: isFree
      ? `File miễn phí của bạn đã sẵn sàng — ${orderLabel}`
      : `Đơn hàng của bạn đã sẵn sàng — ${orderLabel}`,
    html: `
      <p>Chào ${customerName},</p>
      <p>${intro}</p>
      <p>Bấm vào ${items.length > 1 ? "các link" : "link"} bên dưới để tải file:</p>
      ${linksHtml}
      <p>Link tải có hiệu lực đến <strong>${expiresText}</strong>. Nếu hết hạn, vui lòng liên hệ để được cấp lại.</p>
      <p>Trân trọng!</p>
    `,
  });
}
