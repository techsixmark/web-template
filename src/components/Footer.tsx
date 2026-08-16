export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-500">
        <p>
          © {new Date().getFullYear()} TemplateShop. Thanh toán qua chuyển
          khoản ngân hàng — giao file tự động qua email sau khi xác nhận
          thanh toán.
        </p>
      </div>
    </footer>
  );
}
