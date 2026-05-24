import { MapPin, ChevronRight, Navigation } from "lucide-react";
import { formatRp } from "@/lib/utils";

export default function WasteBankCard({ bank, onSelect }) {
  const acceptedTypes = bank.accepted_types || [];
  const locationLabel = bank.kecamatan || bank.kota || bank.source_name || "Google Maps";
  const topPrice = acceptedTypes.reduce(
    (max, type) => (type.price_per_kg > max ? type.price_per_kg : max),
    0,
  );

  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(bank)}
      data-testid={`waste-bank-card-${bank.id}`}
      className="w-full text-left flex gap-3 rounded border border-border bg-card hover:border-primary hover:shadow-card transition-all p-3 group"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-muted shrink-0 overflow-hidden">
        {bank.photo_url ? (
          <img src={bank.photo_url} alt={bank.name} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground">
            <MapPin className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {locationLabel}
            </span>
          </div>
          <h3 className="font-bold text-foreground leading-snug line-clamp-1">{bank.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{bank.address}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
          {bank.distance_km !== undefined && bank.distance_km !== null && (
            <>
              <span className="inline-flex items-center gap-1 text-foreground/75">
                <Navigation className="w-3 h-3" />
                {Number(bank.distance_km).toFixed(1)} km
              </span>
              <span className="opacity-50">-</span>
            </>
          )}
          <span>{acceptedTypes.length > 0 ? `${acceptedTypes.length} jenis` : "Data Google Maps"}</span>
          {topPrice > 0 && (
            <>
              <span className="opacity-50">-</span>
              <span className="text-primary font-semibold tabular-nums">
                hingga {formatRp(topPrice)}/kg
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground self-center group-hover:text-primary transition-colors" />
    </button>
  );
}
