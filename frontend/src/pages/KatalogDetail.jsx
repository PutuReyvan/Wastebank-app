import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "@/lib/api";
import { formatRp } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import { CheckCircle2, AlertCircle, BookOpen, Calculator, MapPin } from "lucide-react";

export default function KatalogDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getWasteType(id).then((r) => setItem(r.data)).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div>
        <PageHeader title="Tidak ditemukan" backTo="" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!item) {
    return <div className="h-32 rounded border border-border bg-card animate-pulse" />;
  }

  const unit = item.reference_unit || "Kg";

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Beranda", to: "/" },
          { label: "Katalog", to: "/katalog" },
          { label: item.name },
        ]}
        kicker={`Katalog - ${item.category}`}
        title={item.name}
      />

      <div className="rounded border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          {item.is_eligible ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success/10 border border-success/30 px-2.5 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" /> Diterima bank sampah
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning bg-warning/10 border border-warning/30 px-2.5 py-1 rounded">
              <AlertCircle className="w-3.5 h-3.5" /> Tidak diterima
            </span>
          )}
        </div>
        <div className="kicker">Estimasi referensi</div>
        <div className="text-4xl md:text-5xl font-extrabold text-primary tabular-nums leading-none mt-1">
          {item.is_eligible ? formatRp(item.reference_price_per_kg) : "-"}
          <span className="text-foreground/55 text-xl font-semibold"> /{unit}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          Ini bukan harga final transaksi. Harga aktual mengikuti kondisi material, volume, dan kebijakan bank sampah.
        </p>
        <p className="mt-5 text-foreground/80 leading-relaxed">{item.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to={`/kalkulator?type=${item.id}`}
          data-testid={`katalog-detail-${item.id}-calc`}
          className="rounded bg-primary hover:bg-secondary text-primary-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Calculator className="w-4 h-4" /> Hitung
        </Link>
        <Link
          to="/bank-sampah"
          data-testid={`katalog-detail-${item.id}-banks`}
          className="rounded border border-border bg-card text-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:border-primary transition-colors"
        >
          <MapPin className="w-4 h-4" /> Bank Terdekat
        </Link>
      </div>

      {item.guide_id && (
        <Link
          to={`/panduan/${item.guide_id}`}
          data-testid={`katalog-detail-${item.id}-guide`}
          className="mt-4 flex items-center gap-3 rounded border border-border p-4 hover:border-primary transition-colors"
        >
          <span className="w-10 h-10 rounded bg-primary/10 text-primary grid place-items-center">
            <BookOpen className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="kicker">Panduan terkait</div>
            <div className="font-semibold text-foreground truncate">
              Cara memilah {item.name.toLowerCase()}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
