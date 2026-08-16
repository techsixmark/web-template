export const metadata = {
  title: "Chính sách — TemplateShop",
};

export default function PolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-ink">Chính sách</h1>

      <section id="bao-mat" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-bold text-ink">1. Chính sách bảo mật</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-slate-600">
          <p>
            Khi bạn đặt hàng, chúng tôi chỉ thu thập họ tên và email — dùng
            duy nhất để xử lý đơn hàng và gửi file bạn đã mua/đăng ký. Chúng
            tôi không thu thập số điện thoại, địa chỉ, hay thông tin thẻ
            ngân hàng qua website.
          </p>
          <p>
            Dữ liệu được lưu trữ trên hạ tầng Supabase (đặt tại khu vực Đông
            Nam Á) với quyền truy cập giới hạn chỉ cho hệ thống xử lý đơn
            hàng. Chúng tôi không bán hoặc chia sẻ email của bạn cho bên thứ
            ba vì mục đích quảng cáo.
          </p>
          <p>
            Thông tin giao dịch được chia sẻ với 2 đối tác kỹ thuật cần
            thiết để hoàn tất đơn hàng: <strong>SePay</strong> (đối soát
            thanh toán ngân hàng) và <strong>Resend</strong> (gửi email giao
            file).
          </p>
        </div>
      </section>

      <section id="thanh-toan" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-bold text-ink">2. Chính sách thanh toán</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-slate-600">
          <p>
            Chúng tôi chỉ nhận thanh toán qua <strong>chuyển khoản ngân
            hàng bằng mã VietQR</strong>. Sau khi tạo đơn, hệ thống hiển thị
            mã QR kèm nội dung chuyển khoản riêng cho đơn hàng đó — bạn quét
            mã và chuyển khoản trực tiếp từ app ngân hàng.
          </p>
          <p>
            Giao dịch được đối soát <strong>tự động</strong> trong vòng
            khoảng 30 giây sau khi tiền về tài khoản, không cần bạn gửi biên
            lai hay chờ admin xác nhận thủ công. Nếu quá 15 phút mà đơn vẫn
            chưa được xác nhận, vui lòng liên hệ để được hỗ trợ kiểm tra.
          </p>
          <p>
            Hiện tại chúng tôi <strong>chưa hỗ trợ</strong> thanh toán qua
            thẻ tín dụng/ghi nợ quốc tế, ví điện tử (Momo, ZaloPay) hay
            COD.
          </p>
        </div>
      </section>

      <section id="giao-hang" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-bold text-ink">3. Chính sách giao hàng (sản phẩm số)</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-slate-600">
          <p>
            Tất cả sản phẩm là <strong>file số</strong> (Google Sheets/
            Excel...) — không giao hàng vật lý. Ngay sau khi thanh toán được
            xác nhận (hoặc ngay khi đăng ký với sản phẩm miễn phí), hệ thống
            tự động gửi email kèm link tải.
          </p>
          <p>
            Link tải có hiệu lực trong <strong>48 giờ</strong> kể từ lúc
            được cấp. Nếu hết hạn trước khi bạn kịp tải, vui lòng liên hệ để
            được cấp lại link mới — miễn phí, không giới hạn số lần với đơn
            hàng đã thanh toán hợp lệ.
          </p>
          <p>
            Không nhận được email? Vui lòng kiểm tra thư mục Spam/Quảng cáo
            trước khi liên hệ hỗ trợ.
          </p>
        </div>
      </section>
    </div>
  );
}
