import Link from "next/link";

export function CategoryBanner({
  eyebrow,
  title,
  subtitle,
  description,
  image,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  reverse,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  reverse?: boolean;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <section className={isDark ? "bg-ink" : "bg-white"}>
      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
        </div>

        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isDark ? "text-accent-400" : "text-brand-600"
            }`}
          >
            {eyebrow}
          </span>
          <h2 className={`mt-2 text-3xl font-bold ${isDark ? "text-white" : "text-ink"}`}>
            {title}
          </h2>
          <p className={`mt-1 text-lg font-medium ${isDark ? "text-slate-300" : "text-slate-500"}`}>
            {subtitle}
          </p>
          <p className={`mt-4 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className={`inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-300 text-ink hover:bg-slate-50"
              }`}
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
