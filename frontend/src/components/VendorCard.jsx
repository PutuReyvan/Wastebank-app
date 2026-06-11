import { Link } from "react-router-dom";
import { MessageCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorCard({ vendor }) {
  const isNgo = vendor.type === "ngo";
  return (
    <div
      data-testid={`vendor-card-${vendor.id}`}
      className="rounded border border-border bg-card p-4 flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
            isNgo ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary",
          )}
        >
          {isNgo ? "NGO" : "Bisnis"}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          #{String(vendor.id).padStart(2, "0")}
        </span>
      </div>
      <Link
        to={`/vendor/${vendor.id}`}
        data-testid={`vendor-card-${vendor.id}-title`}
        className="block mt-2 font-bold text-foreground hover:text-primary leading-snug line-clamp-2 min-h-[2.5em]"
      >
        {vendor.name}
      </Link>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        <span className="truncate">{vendor.service_area}</span>
      </div>
      {vendor.description && (
        <p className="text-sm text-foreground/70 mt-2 line-clamp-2 leading-relaxed flex-1">
          {vendor.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {(vendor.accepted_waste_types || []).slice(0, 3).map((t) => (
          <span
            key={t.id}
            className="text-[11px] font-medium text-foreground/70 bg-muted border border-border px-2 py-0.5 rounded"
          >
            {t.name}
          </span>
        ))}
        {vendor.accepted_waste_types && vendor.accepted_waste_types.length > 3 && (
          <span className="text-[11px] text-muted-foreground px-2 py-0.5">
            +{vendor.accepted_waste_types.length - 3}
          </span>
        )}
      </div>
      <button
        type="button"
        disabled
        data-testid={`vendor-card-${vendor.id}-wa-cta`}
        className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded bg-muted text-muted-foreground font-semibold text-sm py-2.5"
      >
        <MessageCircle className="w-4 h-4" strokeWidth={2.4} /> Kontak demo
      </button>
    </div>
  );
}
