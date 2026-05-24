import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import GuideCard from "@/components/GuideCard";
import PageHeader from "@/components/PageHeader";

export default function Panduan() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getGuides()
      .then((r) => setGuides(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Beranda", to: "/" }, { label: "Panduan Daur Ulang" }]}
        kicker="05 / Edukasi"
        title="Panduan Daur Ulang"
        subtitle="Tips memilah & menyiapkan sampah agar bernilai jual lebih tinggi."
      />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      )}
    </div>
  );
}
