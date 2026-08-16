const BADGES = [
  { icon: "🔒", title: "Thanh toán an toàn", desc: "Chuyển khoản trực tiếp qua VietQR, không lưu thông tin thẻ" },
  { icon: "⚡", title: "Giao hàng tự động", desc: "Nhận file qua email trong vài giây sau khi xác nhận thanh toán" },
  { icon: "✉️", title: "Hỗ trợ qua email", desc: "Liên hệ được hỗ trợ nếu link tải gặp sự cố" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {BADGES.map((b) => (
        <div key={b.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <span className="text-xl">{b.icon}</span>
          <div>
            <p className="text-sm font-semibold text-ink">{b.title}</p>
            <p className="text-xs text-slate-500">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
