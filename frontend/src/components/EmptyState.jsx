import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className, testId = "empty-state" }) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded border border-dashed border-border bg-card p-10 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="w-10 h-10 rounded bg-muted grid place-items-center mx-auto mb-3 text-muted-foreground">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="font-bold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto mt-1">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
