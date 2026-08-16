"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.slug === product.slug);

  function handleClick() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.preview_images[0] ?? null,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={inCart}
      className="inline-flex items-center rounded-full border border-ink px-6 py-3 text-base font-semibold text-ink transition hover:bg-slate-50 disabled:cursor-default disabled:opacity-60"
    >
      {inCart ? "Đã có trong giỏ ✓" : justAdded ? "Đã thêm ✓" : "Thêm vào giỏ hàng"}
    </button>
  );
}
