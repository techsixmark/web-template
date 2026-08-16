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

export async function sendDownloadEmail(params: {
  to: string;
  customerName: string;
  productName: string;
  downloadUrl: string;
  expiresAt: Date;
}) {
  const { to, customerName, productName, downloadUrl, expiresAt } = params;
  const expiresText = expiresAt.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const EMAIL_FROM = process.env.EMAIL_FROM!;

  return getResendClient().emails.send({
    from: EMAIL_FROM,
    to,
    subject: `Đơn hàng của bạn đã sẵn sàng — ${productName}`,
    html: `
      <p>Chào ${customerName},</p>
      <p>Cảm ơn bạn đã mua <strong>${productName}</strong>. Thanh toán của bạn đã được xác nhận thành công.</p>
      <p>Bấm vào link bên dưới để tải file:</p>
      <p><a href="${downloadUrl}" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px">Tải template</a></p>
      <p>Link tải có hiệu lực đến <strong>${expiresText}</strong>. Nếu hết hạn, vui lòng liên hệ để được cấp lại.</p>
      <p>Trân trọng!</p>
    `,
  });
}
