import { useEffect, useMemo, useState } from "react";
import { Search, PackageSearch } from "lucide-react";
import * as api from "@/lib/api";
import { WasteTypeRow } from "@/components/WasteTypeCard";
import { wasteCategories } from "@/lib/mockData";
import FilterChips from "@/components/FilterChips";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import WasteTypeModal from "@/components/WasteTypeModal";
import { WasteTypeRowSkeleton } from "@/components/SkeletonCards";

export default function Katalog() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getWasteTypes({ category }).then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, [category]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((w) => w.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Beranda", to: "/" }, { label: "Katalog Sampah" }]}
        kicker="01 / Direktori Harga"
        title="Katalog Sampah"
        subtitle="Estimasi referensi sampah yang umumnya diterima bank sampah. Harga aktual tetap mengikuti tempat setor."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="katalog-search"
            type="search"
            placeholder="Cari jenis sampah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ds-input pl-9"
          />
        </div>
      </div>

      <div className="mb-5">
        <FilterChips
          options={wasteCategories}
          value={category}
          onChange={setCategory}
          testIdPrefix="katalog-filter"
        />
      </div>

      {loading ? (
        <div className="rounded border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr className="kicker">
                <th className="px-4 py-2.5 text-left font-medium w-12">#</th>
                <th className="px-4 py-2.5 text-left font-medium">Jenis Sampah</th>
                <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Kategori</th>
                <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Estimasi / kg</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <WasteTypeRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="Tidak ada hasil"
          description="Coba ubah kategori atau hapus kata kunci pencarian."
        />
      ) : (
        <div className="rounded border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr className="kicker">
                <th className="px-4 py-2.5 text-left font-medium w-12">#</th>
                <th className="px-4 py-2.5 text-left font-medium">Jenis Sampah</th>
                <th className="px-4 py-2.5 text-left font-medium hidden md:table-cell">Kategori</th>
                <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Estimasi / kg</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <WasteTypeRow key={w.id} item={w} onSelect={setPicked} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
        * Estimasi referensi adalah perkiraan awal. Harga aktual ditentukan oleh masing-masing bank
        sampah, kondisi material, volume, dan tanggal setor.
      </p>

      <WasteTypeModal item={picked} onClose={() => setPicked(null)} />
    </div>
  );
}
