import { formatRp } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export function WasteTypeRow({ item, onSelect }) {
  const unit = item.reference_unit || "Kg";

  return (
    <tr
      onClick={() => onSelect && onSelect(item)}
      data-testid={`waste-row-${item.id}`}
      className="border-t border-border hover:bg-primary/5 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums w-12">
        {String(item.id).padStart(2, "0")}
      </td>
      <td className="px-4 py-3">
        <div className="font-semibold text-foreground">{item.name}</div>
        <div className="text-[11px] text-muted-foreground sm:hidden">{item.category}</div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{item.category}</td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {item.is_eligible ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
            <CheckCircle2 className="w-3 h-3" /> Diterima
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-warning">Tidak diterima</span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-bold tabular-nums text-primary whitespace-nowrap">
        {item.is_eligible ? `${formatRp(item.reference_price_per_kg)}` : "-"}
        <span className="text-foreground/50 text-xs font-medium">/{unit}</span>
      </td>
    </tr>
  );
}

export default function WasteTypeCard({ item, onSelect }) {
  const unit = item.reference_unit || "Kg";

  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(item)}
      data-testid={`waste-card-${item.id}`}
      className="text-left rounded border border-border bg-card hover:border-primary hover:shadow-card transition-all p-4 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="kicker">{item.category}</div>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          #{String(item.id).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-2 font-bold text-foreground leading-snug line-clamp-2 min-h-[2.5em]">
        {item.name}
      </h3>
      <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
        <span className="font-bold text-primary tabular-nums">
          {item.is_eligible ? formatRp(item.reference_price_per_kg) : "-"}
        </span>
        <span className="text-[11px] text-muted-foreground">estimasi /{unit}</span>
      </div>
    </button>
  );
}
