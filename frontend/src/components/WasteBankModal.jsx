import { Link } from "react-router-dom";
import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { formatRp, formatRelativeId } from "@/lib/utils";
import { waLink, defaultBankMessage } from "@/lib/wa";
import { googlePlaceEmbedUrl } from "@/lib/maps";
import Modal from "@/components/Modal";

export default function WasteBankModal({ bank, onClose }) {
  const open = Boolean(bank);
  if (!bank) return <Modal open={false} onClose={onClose} testId="bank-modal" />;

  const acceptedTypes = bank.accepted_types || [];
  const sourceLabel =
    bank.source_name || [bank.kecamatan, bank.kota || "Jakarta Barat"].filter(Boolean).join(" - ");
  const isGooglePlace = String(bank.id || "").startsWith("google-");
  const mapUrl = googlePlaceEmbedUrl(bank);

  return (
    <Modal open={open} onClose={onClose} testId="bank-modal" size="lg">
      {bank.photo_url && (
        <div className="aspect-[16/9] md:aspect-[16/6] bg-muted overflow-hidden">
          <img src={bank.photo_url} alt={bank.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-5 md:px-7 py-6">
        <div className="kicker mb-1.5">{sourceLabel || "Lokasi Bank Sampah"}</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          {bank.name}
        </h2>

        <div className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-foreground/85">{bank.address}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-foreground/85">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{bank.operating_hours || "Jam operasional belum tersedia"}</span>
          </div>
          {bank.rating && (
            <div className="text-xs text-muted-foreground">
              Rating Google Maps: <span className="font-semibold text-foreground">{bank.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-5 rounded border border-border overflow-hidden bg-muted">
          <iframe
            title={`Lokasi ${bank.name}`}
            data-testid="bank-modal-map"
            src={mapUrl}
            width="100%"
            height="260"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {(bank.whatsapp || bank.phone) && (
          <div className="grid grid-cols-1 gap-2.5 mt-5 sm:grid-cols-2">
            {bank.whatsapp && (
              <a
                href={waLink(bank.whatsapp, defaultBankMessage(bank.name))}
                target="_blank"
                rel="noreferrer"
                data-testid="bank-modal-wa-cta"
                className="rounded bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold py-2.5 text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {bank.phone && (
              <a
                href={`tel:${bank.phone}`}
                data-testid="bank-modal-phone-cta"
                className="rounded border border-border bg-card text-foreground hover:border-primary font-semibold py-2.5 text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" /> Telepon
              </a>
            )}
          </div>
        )}

        <div className="kicker mt-7 mb-2">Sampah & harga yang diterima</div>
        {acceptedTypes.length > 0 ? (
          <div className="rounded border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {acceptedTypes.map((type, index) => (
                  <tr
                    key={type.waste_type_id}
                    data-testid={`bank-modal-catalog-${type.waste_type_id}`}
                    className={index === 0 ? "" : "border-t border-border"}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{type.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {type.category} - diperbarui {formatRelativeId(type.updated_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-primary whitespace-nowrap">
                      {formatRp(type.price_per_kg)}
                      <span className="text-foreground/55 text-xs font-medium">/kg</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Google Maps hanya menyediakan data lokasi. Jenis sampah dan harga perlu dikonfirmasi langsung ke tempatnya.
          </div>
        )}

        {!isGooglePlace && (
          <Link
            to={`/bank-sampah/${bank.id}`}
            onClick={onClose}
            data-testid="bank-modal-detail-link"
            className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
          >
            Buka halaman lengkap
          </Link>
        )}
      </div>
    </Modal>
  );
}
