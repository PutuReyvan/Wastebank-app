import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save, Trash2, Plus, CheckCircle2 } from "lucide-react";
import * as api from "@/lib/api";
import { formatRp, formatRelativeId } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";

function useBankSession() {
  const nav = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("bs_token") : null;
  const bankId = typeof window !== "undefined" ? localStorage.getItem("bs_bank_id") : null;

  useEffect(() => {
    if (!token || !bankId) nav("/login");
  }, [token, bankId, nav]);

  const logout = () => {
    localStorage.removeItem("bs_token");
    localStorage.removeItem("bs_bank_id");
    nav("/login");
  };

  return { token, bankId, logout };
}

export default function BankDashboard() {
  const { bankId, logout } = useBankSession();
  const [bank, setBank] = useState(null);
  const [types, setTypes] = useState([]);
  const [profile, setProfile] = useState({});
  const [catalog, setCatalog] = useState([]);
  const [savedFlash, setSavedFlash] = useState("");

  useEffect(() => {
    if (!bankId) return;
    api.getWasteBank(bankId).then((r) => {
      setBank(r.data);
      setProfile({
        name: r.data.name,
        address: r.data.address,
        phone: r.data.phone,
        whatsapp: r.data.whatsapp,
        operating_hours: r.data.operating_hours,
        photo_url: r.data.photo_url,
      });
      setCatalog(
        (r.data.accepted_types || []).map((t) => ({
          waste_type_id: t.waste_type_id,
          name: t.name,
          price_per_kg: t.price_per_kg,
          updated_at: t.updated_at,
        })),
      );
    });
    api.getWasteTypes({ is_eligible: true }).then((r) => setTypes(r.data));
  }, [bankId]);

  if (!bank)
    return <div className="h-32 rounded-2xl bg-card border border-border animate-pulse" />;

  const flash = (msg) => {
    setSavedFlash(msg);
    setTimeout(() => setSavedFlash(""), 2400);
  };

  const saveProfile = async () => {
    const updated = await api.updateWasteBankProfile(bankId, profile);
    setBank(updated.data);
    flash("Profil berhasil disimpan");
  };

  const saveCatalog = async () => {
    const updated = await api.replaceWasteBankCatalog(
      bankId,
      catalog.map((c) => ({
        waste_type_id: c.waste_type_id,
        price_per_kg: Number(c.price_per_kg) || 0,
      })),
    );
    setCatalog(
      (updated.data.accepted_types || []).map((t) => ({
        waste_type_id: t.waste_type_id,
        name: t.name,
        price_per_kg: t.price_per_kg,
        updated_at: t.updated_at,
      })),
    );
    flash("Katalog berhasil disimpan");
  };

  const addCatalogRow = () => {
    setCatalog((c) => [...c, { waste_type_id: "", name: "", price_per_kg: "", updated_at: null }]);
  };
  const updateCatalogRow = (idx, key, val) => {
    setCatalog((c) =>
      c.map((row, i) => {
        if (i !== idx) return row;
        const next = { ...row, [key]: val };
        if (key === "waste_type_id") {
          const t = types.find((x) => x.id === Number(val));
          next.name = t ? t.name : "";
        }
        return next;
      }),
    );
  };
  const removeCatalogRow = (idx) => setCatalog((c) => c.filter((_, i) => i !== idx));

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Portal", to: "/login" }, { label: bank.name }]}
        kicker={`Portal · Bank #${bank.id}`}
        title={bank.name}
        subtitle="Edit profil dan harga sampah yang Anda terima."
        action={
          <button
            type="button"
            onClick={logout}
            data-testid="dashboard-logout"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive px-3 py-2 rounded border border-border bg-card transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        }
      />

      {savedFlash && (
        <div
          data-testid="dashboard-flash"
          className="mb-5 rounded bg-success/10 border border-success/30 text-success px-4 py-2.5 text-sm inline-flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> {savedFlash}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <section className="rounded border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Profil bank sampah</h2>
          <div className="space-y-3">
            <Field label="Nama">
              <input
                data-testid="dashboard-profile-name"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="ds-input"
              />
            </Field>
            <Field label="Alamat">
              <textarea
                data-testid="dashboard-profile-address"
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={2}
                className="ds-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telepon">
                <input
                  data-testid="dashboard-profile-phone"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="ds-input"
                />
              </Field>
              <Field label="WhatsApp">
                <input
                  data-testid="dashboard-profile-whatsapp"
                  value={profile.whatsapp || ""}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  className="ds-input"
                />
              </Field>
            </div>
            <Field label="Jam operasional">
              <input
                data-testid="dashboard-profile-hours"
                value={profile.operating_hours || ""}
                onChange={(e) => setProfile({ ...profile, operating_hours: e.target.value })}
                placeholder="Sen–Sab, 08.00–16.00"
                className="ds-input"
              />
            </Field>
            <Field label="URL foto">
              <input
                data-testid="dashboard-profile-photo"
                value={profile.photo_url || ""}
                onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                className="ds-input"
              />
            </Field>
            <button
              type="button"
              onClick={saveProfile}
              data-testid="dashboard-profile-save"
              className="w-full rounded bg-primary hover:bg-secondary text-primary-foreground font-semibold py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" /> Simpan profil
            </button>
          </div>
        </section>

        {/* Catalog */}
        <section className="rounded border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Katalog harga</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Jenis sampah yang Anda terima beserta harganya per kg.
          </p>
          <div className="space-y-2">
            {catalog.map((row, idx) => (
              <div
                key={idx}
                data-testid={`dashboard-catalog-row-${idx}`}
                className="rounded border border-border bg-muted/40 p-3"
              >
                <div className="flex gap-2">
                  <select
                    value={row.waste_type_id}
                    onChange={(e) => updateCatalogRow(idx, "waste_type_id", e.target.value)}
                    data-testid={`dashboard-catalog-row-${idx}-type`}
                    className="ds-input flex-1 min-w-0"
                  >
                    <option value="">Pilih jenis sampah…</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeCatalogRow(idx)}
                    data-testid={`dashboard-catalog-row-${idx}-remove`}
                    className="shrink-0 w-10 h-10 rounded border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive grid place-items-center transition-colors"
                    aria-label="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    inputMode="numeric"
                    value={row.price_per_kg}
                    onChange={(e) => updateCatalogRow(idx, "price_per_kg", e.target.value)}
                    data-testid={`dashboard-catalog-row-${idx}-price`}
                    className="ds-input w-32 tabular-nums"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">/kg</span>
                  {row.updated_at && (
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      {formatRelativeId(row.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCatalogRow}
            data-testid="dashboard-catalog-add"
            className="mt-3 w-full rounded border border-dashed border-border hover:border-primary hover:text-primary text-muted-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah jenis
          </button>

          <button
            type="button"
            onClick={saveCatalog}
            data-testid="dashboard-catalog-save"
            className="mt-3 w-full rounded bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan katalog
          </button>

          <div className="mt-4 text-xs text-muted-foreground tabular-nums">
            Total {catalog.length} jenis · tertinggi:{" "}
            <span className="font-semibold text-foreground">
              {formatRp(Math.max(0, ...catalog.map((c) => Number(c.price_per_kg) || 0)))}/kg
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
