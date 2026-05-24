import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="kicker mb-4">Error · 404</div>
      <h1 className="text-5xl font-extrabold text-primary tabular-nums">404</h1>
      <p className="text-lg text-foreground/75 mt-3">Halaman tidak ditemukan.</p>
      <Link
        to="/"
        data-testid="notfound-home"
        className="mt-6 inline-flex rounded bg-primary hover:bg-secondary text-primary-foreground font-semibold px-5 py-2.5 text-sm transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
