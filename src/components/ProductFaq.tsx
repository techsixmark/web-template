const FAQ_ITEMS = [
  {
    q: "Tôi nhận được gì sau khi mua?",
    a: "Ngay sau khi hệ thống xác nhận thanh toán, bạn nhận 1 email chứa link tải file template. File ở định dạng Google Sheets, có thể mở trực tiếp hoặc tải về dùng trên Excel.",
  },
  {
    q: "Link tải có hết hạn không?",
    a: "Link tải có hiệu lực trong 48 giờ kể từ lúc được cấp. Nếu hết hạn trước khi bạn tải xong, liên hệ để được cấp lại link mới miễn phí.",
  },
  {
    q: "Không thấy email, phải làm sao?",
    a: "Vui lòng kiểm tra thư mục Spam/Quảng cáo trước. Nếu vẫn không thấy sau vài phút, liên hệ để được hỗ trợ kiểm tra đơn hàng.",
  },
  {
    q: "Có dùng được trên điện thoại không?",
    a: "Có — vì là Google Sheets/Excel nên dùng được trên máy tính, điện thoại, máy tính bảng có ứng dụng Google Sheets hoặc Excel.",
  },
];

export function ProductFaq() {
  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl border border-slate-200 bg-white px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
            {item.q}
            <span className="ml-2 text-slate-400 transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
