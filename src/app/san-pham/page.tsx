import { ProductCard } from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";

export const revalidate = 60;

export default async function ProductListPage() {
  const products = await getActiveProducts();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Tất cả sản phẩm</h1>
      <p className="mt-2 text-zinc-600">
        {products.length} template đang mở bán.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-zinc-500">
          Chưa có sản phẩm nào. Vui lòng quay lại sau.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
