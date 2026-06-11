import { Skeleton } from "@/components/ui/skeleton";

/** Matches the shape of WasteBankCard */
export function WasteBankCardSkeleton() {
  return (
    <div className="w-full flex gap-3 rounded border border-border bg-card p-3">
      {/* Photo thumbnail */}
      <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Location kicker */}
          <Skeleton className="h-3 w-20 mb-1.5" />
          {/* Title */}
          <Skeleton className="h-4 w-3/4 mb-1" />
          {/* Address */}
          <Skeleton className="h-3 w-1/2" />
        </div>
        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      {/* Chevron */}
      <Skeleton className="w-4 h-4 self-center shrink-0" />
    </div>
  );
}

/** Matches the shape of VendorCard */
export function VendorCardSkeleton() {
  return (
    <div className="rounded border border-border bg-card p-4 flex flex-col">
      {/* Badge + ID row */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-3 w-8" />
      </div>
      {/* Name */}
      <Skeleton className="h-5 w-5/6 mt-3 mb-1" />
      <Skeleton className="h-4 w-2/3" />
      {/* Area */}
      <Skeleton className="h-3 w-1/2 mt-2" />
      {/* Description */}
      <Skeleton className="h-3 w-full mt-3" />
      <Skeleton className="h-3 w-4/5 mt-1" />
      {/* Tags */}
      <div className="flex gap-1 mt-3">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-12 rounded" />
      </div>
      {/* CTA button */}
      <Skeleton className="h-10 w-full mt-4 rounded" />
    </div>
  );
}

/** Matches the shape of GuideCard */
export function GuideCardSkeleton() {
  return (
    <div className="rounded border border-border bg-card overflow-hidden">
      {/* Cover image */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="p-4">
        {/* Kicker */}
        <Skeleton className="h-3 w-24 mb-2" />
        {/* Title */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        {/* Excerpt */}
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-5/6 mb-3" />
        {/* Date */}
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/** Matches the shape of a table row in Katalog / Home hot-prices */
export function WasteTypeRowSkeleton() {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 w-12">
        <Skeleton className="h-3 w-5" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Skeleton className="h-5 w-16 rounded" />
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <Skeleton className="h-5 w-14 rounded" />
      </td>
      <td className="px-4 py-3 text-right">
        <Skeleton className="h-4 w-20 ml-auto" />
      </td>
    </tr>
  );
}

/** Stat box skeleton for Home page stats grid */
export function StatSkeleton() {
  return (
    <div className="bg-card px-4 py-4">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/** Home page hero section skeleton (banks + hot-prices) */
export function HomeSectionSkeleton({ rows = 5, type = "bank" }) {
  if (type === "table") {
    return (
      <div className="rounded border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              {["w-12", "flex-1", "w-24 hidden md:table-cell", "w-20 hidden sm:table-cell", "w-28"].map(
                (w, i) => (
                  <th key={i} className={`px-4 py-2.5 ${w}`}>
                    <Skeleton className="h-3 w-16" />
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <WasteTypeRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <WasteBankCardSkeleton key={i} />
      ))}
    </div>
  );
}
