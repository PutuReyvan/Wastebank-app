import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import * as api from "@/lib/api";
import PageHeader from "@/components/PageHeader";

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getVendor(id).then((r) => setVendor(r.data)).catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <div>
        <PageHeader title="Tidak ditemukan" backTo="" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );

  if (!vendor)
    return <div className="h-32 rounded border border-border bg-card animate-pulse" />;

  const isNgo = vendor.type === "ngo";

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Beranda", to: "/" },
          { label: "Vendor", to: "/vendor" },
          { label: vendor.name },
        ]}
        kicker={`Vendor · ${isNgo ? "NGO" : "Bisnis"}`}
        title={vendor.name}
      />

      <div className="rounded border border-border bg-card p-5">
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
            isNgo ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"
          }`}
        >
          {isNgo ? "NGO" : "Bisnis"}
        </span>
        <p className="mt-4 text-foreground/80 leading-relaxed">{vendor.description}</p>
        <div className="mt-4 flex items-start gap-2 text-sm text-foreground/85">
          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <span>Area layanan: {vendor.service_area}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          disabled
          data-testid="vendor-detail-wa-cta"
          className="rounded bg-muted text-muted-foreground font-semibold py-3 text-sm inline-flex cursor-not-allowed items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> Kontak demo
        </button>
        <button
          type="button"
          disabled
          data-testid="vendor-detail-phone-cta"
          className="rounded border border-border bg-muted text-muted-foreground font-semibold py-3 text-sm inline-flex cursor-not-allowed items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" /> Telepon
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Kontak vendor disembunyikan untuk demo agar tidak mengarah ke nomor pribadi.
      </p>

      <h2 className="text-xl font-bold text-foreground mt-10 mb-3">Sampah yang diterima</h2>
      <div className="flex flex-wrap gap-2">
        {(vendor.accepted_waste_types || []).map((t) => (
          <span
            key={t.id}
            data-testid={`vendor-detail-type-${t.id}`}
            className="text-sm font-medium text-foreground/80 bg-card border border-border px-3 py-1.5 rounded"
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
