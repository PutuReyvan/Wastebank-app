import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Menu, X, Recycle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Beranda", code: "00" },
  { to: "/katalog", label: "Katalog Sampah", code: "01" },
  { to: "/kalkulator", label: "Kalkulator Harga", code: "02" },
  { to: "/bank-sampah", label: "Direktori Bank Sampah", code: "03" },
  { to: "/price-list", label: "Price List", code: "04" },
  { to: "/panduan", label: "Panduan Daur Ulang", code: "05" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="h-1 bg-primary" />

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-md mx-auto md:max-w-6xl px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <Link to="/" data-testid="brand-link" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded bg-primary text-primary-foreground grid place-items-center">
              <Recycle className="w-4 h-4" strokeWidth={2.4} />
            </span>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-foreground">
                Pilah<span className="text-primary">.in</span>
              </div>
              <div className="kicker hidden sm:block">Direktori Warga - Jakarta Barat</div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            data-testid="hamburger-open"
            className="w-9 h-9 rounded border border-border bg-card hover:border-primary hover:text-primary text-foreground grid place-items-center transition-colors"
            aria-label="Buka menu"
          >
            <Menu className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-md mx-auto md:max-w-6xl w-full px-4 md:px-8 pt-6 md:pt-10 pb-16">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-border bg-card">
        <div className="max-w-md mx-auto md:max-w-6xl px-4 md:px-8 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>2026 Pilah.in</span>
          <span>Direktori daur ulang Jakarta Barat</span>
        </div>
      </footer>

      <div
        data-testid="hamburger-overlay"
        className={cn(
          "fixed inset-0 z-50 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup menu"
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        />
        <aside
          className={cn(
            "absolute top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border shadow-pop",
            "transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="kicker">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-testid="hamburger-close"
              className="w-8 h-8 rounded border border-border hover:border-primary hover:text-primary grid place-items-center transition-colors"
              aria-label="Tutup menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="px-3 py-3">
            <ul>
              {NAV.map(({ to, label, code }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    onClick={() => setOpen(false)}
                    data-testid={`hamburger-nav-${to.replace(/\//g, "-") || "home"}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-4 px-3 py-3 rounded transition-colors border-b border-border last:border-0",
                        isActive ? "bg-primary/8 text-primary" : "text-foreground hover:bg-muted",
                      )
                    }
                  >
                    <span className="font-mono text-xs tabular-nums w-6 text-muted-foreground">
                      {code}
                    </span>
                    <span className="font-semibold text-sm">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
