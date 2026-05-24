import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Phone, MessageCircle, Clock, MapPin, ExternalLink } from "lucide-react";
import * as api from "@/lib/api";
import { formatRp, formatRelativeId } from "@/lib/utils";
import { waLink, defaultBankMessage } from "@/lib/wa";
import PageHeader from "@/components/PageHeader";

export default function BankSampahDetail() {
  const { id } = useParams();
  const [bank, setBank] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getWasteBank(id).then((r) => setBank(r.data)).catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <div>
        <PageHeader title="Tidak ditemukan" backTo="" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );

  if (!bank)
    return <div className="h-32 rounded border border-border bg-card animate-pulse" />;

  const mapsLink = `https://www.google.com/maps?q=${bank.lat},${bank.lng}`;
  const embedSrc = `https://www.google.com/maps?q=${bank.lat},${bank.lng}&z=16&output=embed`;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Beranda", to: "/" },
          { label: "Bank Sampah", to: "/bank-sampah" },
          { label: bank.name },
        ]}
        kicker={`Bank Sampah - ${bank.kecamatan}`}
        title={bank.name}
      />

      {bank.photo_url && (
        <div className="rounded border border-border overflow-hidden mb-6 aspect-[16/9] bg-muted">
          <img src={bank.photo_url} alt={bank.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="rounded border border-border bg-card p-5">
        <div className="flex items-start gap-2.5 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div>
            <div className="text-foreground/85">{bank.address}</div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              data-testid="bank-detail-maps-link"
              className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-1 hover:underline"
            >
              Buka di Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-foreground/85 mt-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{bank.operating_hours}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <a
          href={waLink(bank.whatsapp, defaultBankMessage(bank.name))}
          target="_blank"
          rel="noreferrer"
          data-testid="bank-detail-wa-cta"
          className="rounded bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <a
          href={`tel:${bank.phone}`}
          data-testid="bank-detail-phone-cta"
          className="rounded border border-border bg-card text-foreground hover:border-primary font-semibold py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-4 h-4" /> Telepon
        </a>
      </div>

      <h2 className="text-xl font-bold text-foreground mt-10 mb-3">Sampah & harga yang diterima</h2>
      <div className="rounded border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr className="kicker">
              <th className="px-4 py-2.5 text-left font-medium">Jenis Sampah</th>
              <th className="px-4 py-2.5 text-right font-medium">Harga / kg</th>
            </tr>
          </thead>
          <tbody>
            {(bank.accepted_types || []).map((t, i) => (
              <tr
                key={t.waste_type_id}
                data-testid={`bank-detail-catalog-${t.waste_type_id}`}
                className={i === 0 ? "" : "border-t border-border"}
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {t.category} - diperbarui {formatRelativeId(t.updated_at)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-primary whitespace-nowrap">
                  {formatRp(t.price_per_kg)}<span className="text-foreground/55 text-xs font-medium">/kg</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-foreground mt-10 mb-3">Lokasi</h2>
      <div className="rounded border border-border overflow-hidden bg-muted">
        <iframe
          title={`Peta ${bank.name}`}
          data-testid="bank-detail-map-iframe"
          src={embedSrc}
          width="100%"
          height="320"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
