import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2, AlertCircle, Receipt, Share2 } from "lucide-react";
import * as api from "@/lib/api";
import { formatRp } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import { waLink } from "@/lib/wa";

function newRow(waste_type_id = "", weight_kg = "") {
  return { uid: Math.random().toString(36).slice(2), waste_type_id, weight_kg };
}

export default function Kalkulator() {
  const [params] = useSearchParams();
  const preset = params.get("type");
  const [types, setTypes] = useState([]);
  const [rows, setRows] = useState([newRow(preset || "", preset ? "1" : "")]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    api.getWasteTypes().then((r) => setTypes(r.data));
  }, []);

  const eligibleTypes = useMemo(() => types.filter((t) => t.is_eligible), [types]);

  const canCalculate = rows.some((r) => r.waste_type_id && Number(r.weight_kg) > 0);

  const localPreview = useMemo(() => {
    let total = 0;
    rows.forEach((r) => {
      const t = types.find((x) => x.id === Number(r.waste_type_id));
      if (t && Number(r.weight_kg) > 0) total += t.reference_price_per_kg * Number(r.weight_kg);
    });
    return total;
  }, [rows, types]);

  const update = (uid, key, val) => {
    setRows((rs) => rs.map((r) => (r.uid === uid ? { ...r, [key]: val } : r)));
    setResult(null);
    setError("");
  };
  const removeRow = (uid) =>
    setRows((rs) => (rs.length === 1 ? rs : rs.filter((r) => r.uid !== uid)));

  const onCalculate = async () => {
    setError("");
    setCalculating(true);
    try {
      const items = rows
        .filter((r) => r.waste_type_id && Number(r.weight_kg) > 0)
        .map((r) => ({ waste_type_id: Number(r.waste_type_id), weight_kg: Number(r.weight_kg) }));
      const res = await api.calculateEstimate({ items });
      setResult(res.data);
    } catch (e) {
      setError(e.message || "Gagal menghitung");
    } finally {
      setCalculating(false);
    }
  };

  const shareMessage = () => {
    if (!result) return "";
    const lines = result.items.map(
      (it) => `• ${it.name}: ${it.weight_kg} kg × ${formatRp(it.price_per_kg)}/kg = ${formatRp(it.subtotal)}`,
    );
    return `Estimasi nilai sampah daur ulang saya:\n\n${lines.join("\n")}\n\nTotal: ${formatRp(result.total_estimated)}\n\nDihitung di Pilah.in - direktori warga Jakarta Barat.`;
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Beranda", to: "/" }, { label: "Kalkulator Harga" }]}
        kicker="02 / Kalkulator"
        title="Kalkulator Harga"
        subtitle="Tambahkan item sampah & beratnya, lihat estimasi nilai jualnya."
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.uid}
              data-testid={`calc-row-${row.uid}`}
              className="rounded border border-border bg-card p-3"
            >
              <div className="flex gap-2">
                <select
                  value={row.waste_type_id}
                  onChange={(e) => update(row.uid, "waste_type_id", e.target.value)}
                  data-testid={`calc-row-${row.uid}-type`}
                  className="ds-input flex-1 min-w-0"
                >
                  <option value="">Pilih jenis sampah…</option>
                  {eligibleTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {`${t.name} - ${formatRp(t.reference_price_per_kg)}/${t.reference_unit || "Kg"}`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeRow(row.uid)}
                  data-testid={`calc-row-${row.uid}-remove`}
                  className="shrink-0 w-10 h-10 rounded border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive grid place-items-center transition-colors"
                  aria-label="Hapus item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="Berat (kg)"
                  value={row.weight_kg}
                  onChange={(e) => update(row.uid, "weight_kg", e.target.value)}
                  data-testid={`calc-row-${row.uid}-weight`}
                  className="ds-input w-32 tabular-nums"
                />
                <span className="text-xs text-muted-foreground">kg</span>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, newRow()])}
            data-testid="calc-add-row"
            className="w-full rounded border border-dashed border-border hover:border-primary hover:text-primary text-muted-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah jenis sampah
          </button>

          {error && (
            <div
              data-testid="calc-error"
              className="inline-flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 px-3 py-2 rounded"
            >
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button
            type="button"
            onClick={onCalculate}
            disabled={!canCalculate || calculating}
            data-testid="calc-submit"
            className="w-full rounded bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Receipt className="w-4 h-4" />
            {calculating ? "Menghitung…" : "Hitung Estimasi Lengkap"}
          </button>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <div className="rounded border border-border bg-card p-5">
            <div className="kicker">Estimasi sementara</div>
            <div
              data-testid="calc-live-total"
              className="text-3xl md:text-4xl font-extrabold text-primary tabular-nums leading-none mt-1.5"
            >
              {formatRp(localPreview)}
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Berdasarkan harga referensi. Harga aktual ditentukan oleh bank sampah.
            </p>
          </div>

          {result && (
            <div
              data-testid="calc-result"
              className="mt-3 rounded border border-border bg-card p-5"
            >
              <div className="kicker mb-2">Rincian</div>
              <ul className="divide-y divide-border">
                {result.items.map((it) => (
                  <li key={it.waste_type_id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">{it.name}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {it.weight_kg} kg x {formatRp(it.price_per_kg)}/kg
                      </div>
                    </div>
                    <div className="font-bold text-foreground tabular-nums">
                      {formatRp(it.subtotal)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
                <span className="text-sm font-semibold text-foreground">Total estimasi</span>
                <span className="text-xl font-extrabold text-primary tabular-nums">
                  {formatRp(result.total_estimated)}
                </span>
              </div>
              <a
                href={waLink("", shareMessage())}
                target="_blank"
                rel="noreferrer"
                data-testid="calc-share-wa"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold text-sm py-2.5 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share via WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
