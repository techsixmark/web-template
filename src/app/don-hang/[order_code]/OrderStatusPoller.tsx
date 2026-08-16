"use client";

import { useEffect, useState } from "react";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusPoller({
  orderCode,
  initialStatus,
  customerEmail,
}: {
  orderCode: string;
  initialStatus: OrderStatus;
  customerEmail: string;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  useEffect(() => {
    if (status !== "pending") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderCode}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status && data.status !== status) {
          setStatus(data.status);
        }
      } catch {
        // bỏ qua lỗi mạng tạm thời, sẽ thử lại ở lần poll tiếp theo
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [orderCode, status]);

  if (status === "pending") {
    return (
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        Đang chờ thanh toán — hệ thống tự động kiểm tra mỗi vài giây...
      </p>
    );
  }

  if (status === "paid") {
    return (
      <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
        ✅ Thanh toán thành công! Link tải file đã được gửi tới{" "}
        <strong>{customerEmail}</strong>. Vui lòng kiểm tra hộp thư (và mục
        Spam).
      </p>
    );
  }

  return (
    <p className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm text-zinc-600">
      Đơn hàng đã {status === "expired" ? "hết hạn" : "bị huỷ"}. Vui lòng tạo
      đơn mới nếu bạn vẫn muốn mua.
    </p>
  );
}
