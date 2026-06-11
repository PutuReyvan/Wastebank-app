import { useEffect, useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import * as api from "@/lib/api";
import VendorCard from "@/components/VendorCard";
import FilterChips from "@/components/FilterChips";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { VendorCardSkeleton } from "@/components/SkeletonCards";

const TYPE_OPTIONS = [
  { value: "Semua", label: "Semua" },
  { value: "business", label: "Bisnis" },
  { value: "ngo", label: "NGO" },
];

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [type, setType] = useState("Semua");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getVendors({ type: type === "Semua" ? undefined : type })
      .then((r) => setVendors(r.data))
      .finally(() => setLoading(false));
  }, [type]);

  const filtered = useMemo(() => {
    if (!search.trim()) return vendors;
    const q = search.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) || v.service_area.toLowerCase().includes(q),
    );
  }, [vendors, search]);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Beranda", to: "/" }, { label: "Direktori Vendor" }]}
        kicker="04 / Pickup & Pengepul"
        title="Direktori Vendor"
        subtitle="Pengepul atau NGO referensi untuk kebutuhan demo. Kontak langsung vendor dinonaktifkan sementara."
      />

      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          data-testid="vendor-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau area layanan..."
          className="ds-input pl-9"
        />
      </div>

      <div className="mb-6">
        <FilterChips options={TYPE_OPTIONS} value={type} onChange={setType} testIdPrefix="vendor-type" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <VendorCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Belum ada vendor" description="Coba kata kunci lain." />
      ) : (
        <>
          <div className="kicker mb-3">Menampilkan {filtered.length} vendor</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </>
      )}

      <div className="rounded border border-warning/40 bg-warning/5 p-4 mt-8 text-sm text-foreground/85">
        <strong className="font-bold text-warning">Catatan:</strong> Vendor di sini bukan pegawai
        platform. Kontak vendor disembunyikan sementara untuk mencegah pesan terkirim ke nomor pribadi.
      </div>
    </div>
  );
}
