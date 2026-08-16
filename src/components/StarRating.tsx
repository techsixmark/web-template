export function StarRating({
  value,
  size = "base",
}: {
  value: number;
  size?: "sm" | "base";
}) {
  const cls = size === "sm" ? "text-sm" : "text-lg";
  return (
    <span className={`${cls} text-accent-500`} aria-label={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? "" : "text-slate-200"}>
          ★
        </span>
      ))}
    </span>
  );
}
