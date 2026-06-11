import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { adminHostUrl } from "@/lib/subdomain";

export default function AdminInfo() {
  const adminUrl = adminHostUrl();

  useEffect(() => {
    window.location.replace(adminUrl);
  }, [adminUrl]);

  return (
    <div className="max-w-xl mx-auto rounded border border-border bg-card p-6">
      <div className="kicker mb-2">Akses terbatas</div>
      <h1 className="text-2xl font-bold text-foreground">Mengalihkan ke Panel Admin</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Panel admin berjalan di subdomain terpisah.
      </p>
      <a
        href={adminUrl}
        data-testid="admin-subdomain-redirect"
        className="mt-5 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary transition-colors"
      >
        Buka Panel Admin <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
