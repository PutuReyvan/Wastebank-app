import { Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Calculator, MapPin, BookOpen } from "lucide-react";
import { formatRp } from "@/lib/utils";
import Modal from "@/components/Modal";

export default function WasteTypeModal({ item, onClose }) {
  const open = Boolean(item);
  const unit = item?.reference_unit || "Kg";
  return (
    <Modal open={open} onClose={onClose} testId="waste-modal" size="md">
      {item && (
        <div className="px-5 md:px-7 py-7">
          <div className="kicker mb-2">
            {item.category} - #{String(item.id).padStart(2, "0")}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {item.name}
          </h2>
          <div className="mt-3">
            {item.is_eligible ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 border border-success/30 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" /> Diterima bank sampah
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning bg-warning/10 border border-warning/30 px-2.5 py-1 rounded">
                <AlertCircle className="w-3.5 h-3.5" /> Tidak diterima
              </span>
            )}
          </div>

          <div className="mt-6 rounded border border-border bg-muted/40 p-5">
            <div className="kicker">Estimasi referensi</div>
            <div className="font-extrabold text-3xl md:text-4xl text-primary tabular-nums mt-1">
              {item.is_eligible ? formatRp(item.reference_price_per_kg) : "-"}
              <span className="text-foreground/60 text-base font-semibold"> /{unit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Bukan harga final. Harga aktual mengikuti kondisi barang dan kebijakan bank sampah tujuan.
            </p>
          </div>

          <p className="mt-5 text-foreground/80 leading-relaxed text-sm">{item.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <Link
              to={`/kalkulator?type=${item.id}`}
              onClick={onClose}
              data-testid="waste-modal-cta-calc"
              className="rounded bg-primary hover:bg-secondary text-primary-foreground font-semibold py-2.5 text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4" /> Hitung
            </Link>
            <Link
              to="/bank-sampah"
              onClick={onClose}
              data-testid="waste-modal-cta-banks"
              className="rounded border border-border bg-card hover:border-primary text-foreground font-semibold py-2.5 text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4" /> Bank Terdekat
            </Link>
          </div>

          {item.guide_id && (
            <Link
              to={`/panduan/${item.guide_id}`}
              onClick={onClose}
              data-testid="waste-modal-cta-guide"
              className="mt-4 flex items-center gap-3 rounded border border-border p-3 hover:border-primary transition-colors"
            >
              <span className="w-9 h-9 rounded bg-primary/10 text-primary grid place-items-center">
                <BookOpen className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="kicker">Panduan terkait</div>
                <div className="font-semibold text-foreground text-sm truncate">
                  Cara memilah {item.name.toLowerCase()}
                </div>
              </div>
            </Link>
          )}
        </div>
      )}
    </Modal>
  );
}
