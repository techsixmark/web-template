"use client";

import { useState } from "react";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="aspect-[4/3] w-full bg-slate-100">
          {current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt={alt} className="h-full w-full object-cover" />
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-[4/3] overflow-hidden rounded-lg border-2 bg-slate-100 transition ${
                i === active ? "border-brand-500" : "border-transparent hover:border-slate-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${alt} — ảnh ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
