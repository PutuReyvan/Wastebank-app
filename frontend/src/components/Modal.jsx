import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children, testId, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const widthCls = size === "lg" ? "md:max-w-3xl" : "md:max-w-xl";

  return (
    <div
      data-testid={testId}
      className={cn(
        "fixed inset-0 z-[60] transition-opacity",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute left-0 right-0 bottom-0 md:left-1/2 md:right-auto md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
          "w-full md:w-[calc(100vw-2rem)] mx-auto",
          widthCls,
          "rounded-t-2xl md:rounded-lg bg-card border border-border shadow-pop",
          "max-h-[90vh] overflow-hidden flex flex-col",
          "transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full md:translate-y-0",
        )}
      >
        <div className="md:hidden pt-2 pb-1 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-border" />
        </div>

        <button
          type="button"
          onClick={onClose}
          data-testid={`${testId}-close`}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded border border-border bg-card hover:border-primary hover:text-primary grid place-items-center transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
