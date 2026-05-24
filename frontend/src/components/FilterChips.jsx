import { cn } from "@/lib/utils";

export default function FilterChips({ options, value, onChange, testIdPrefix = "chip" }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const val = typeof opt === "string" ? opt : opt.value;
        const active = value === val;
        return (
          <button
            key={String(val)}
            type="button"
            onClick={() => onChange(val)}
            data-testid={`${testIdPrefix}-${String(val).toLowerCase().replace(/\s+/g, "-")}`}
            className={cn(
              "shrink-0 rounded px-3 py-1.5 text-xs font-semibold transition-colors border",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground/75 hover:border-primary hover:text-primary",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
