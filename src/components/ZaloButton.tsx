const ZALO_LINK = process.env.NEXT_PUBLIC_ZALO_LINK;

export function ZaloButton() {
  if (!ZALO_LINK) return null;

  return (
    <a
      href={ZALO_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Liên hệ qua Zalo"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] text-sm font-bold text-white shadow-lg shadow-[#0068FF]/30 transition hover:scale-105"
    >
      Zalo
    </a>
  );
}
