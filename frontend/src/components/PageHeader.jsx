import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function PageHeader({ kicker, title, subtitle, breadcrumbs, action, backTo }) {
  const nav = useNavigate();
  return (
    <div className="mb-6 md:mb-8">
      {breadcrumbs && (
        <nav className="kicker flex items-center gap-2 mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {b.to ? (
                <Link to={b.to} className="hover:text-primary transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-foreground">{b.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="opacity-50">/</span>}
            </span>
          ))}
        </nav>
      )}
      {(backTo || backTo === "") && !breadcrumbs && (
        <button
          type="button"
          onClick={() => (backTo ? nav(backTo) : nav(-1))}
          data-testid="page-back-button"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </button>
      )}
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {kicker && <div className="kicker mb-2">{kicker}</div>}
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="hr-thin mt-5" />
    </div>
  );
}
