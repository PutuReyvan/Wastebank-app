import { useCallback, useEffect, useMemo, useState } from "react";
import { LocateFixed, Search, MapPinOff, Map as MapIcon, List, RefreshCw } from "lucide-react";
import * as api from "@/lib/api";
import WasteBankCard from "@/components/WasteBankCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import WasteBankModal from "@/components/WasteBankModal";
import { cn } from "@/lib/utils";
import { googlePlaceEmbedUrl } from "@/lib/maps";

const DEFAULT_AREA = "Jakarta Barat";
const DEFAULT_QUERY = "bank sampah";
const DEFAULT_RADIUS = 15000;

export default function BankSampah() {
  const [banks, setBanks] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [error, setError] = useState("");

  const loadBanks = useCallback(
    async (location = userLocation) => {
      setLoading(true);
      setError("");

      try {
        const response = await api.getGoogleWasteBanks({
          lat: location?.lat,
          lng: location?.lng,
          radius: location ? DEFAULT_RADIUS : undefined,
          search: search.trim() || DEFAULT_QUERY,
          area: DEFAULT_AREA,
        });

        setBanks(response.data || []);
        if (location) {
          setLocationStatus("Data Google Maps diurutkan dari lokasi terdekat.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Tidak bisa mengambil data Google Maps saat ini.";
        setError(message);
        setBanks([]);
      } finally {
        setLoading(false);
      }
    },
    [search, userLocation],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadBanks();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [loadBanks]);

  const nearestBank = useMemo(
    () => banks.find((bank) => bank.distance_km !== null && bank.distance_km !== undefined),
    [banks],
  );

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Browser ini belum mendukung deteksi lokasi.");
      return;
    }

    setLocationStatus("Mencari lokasi Anda...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(location);
        loadBanks(location);
      },
      () => {
        setLocationStatus("Tidak bisa membaca lokasi. Pastikan izin lokasi aktif.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Beranda", to: "/" }, { label: "Direktori Bank Sampah" }]}
        kicker="03 / Lokasi Setor"
        title="Direktori Bank Sampah"
        subtitle="Temukan lokasi bank sampah aktif beserta katalog sampah yang diterima."
        action={
          <div className="flex gap-1 rounded border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              data-testid="bank-view-list"
              className={cn(
                "px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              data-testid="bank-view-map"
              className={cn(
                "px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors",
                view === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <MapIcon className="w-3.5 h-3.5" /> Peta
            </button>
          </div>
        }
      />

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          data-testid="bank-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari bank sampah, TPS 3R, atau lokasi..."
          className="ds-input pl-9"
        />
      </div>

      <div className="mb-6 rounded border border-border bg-card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-bold text-foreground">Data lokasi bank sampah</div>
          <div className="text-xs text-muted-foreground mt-1">
            Peta memakai Google Maps embed. API key hanya diperlukan kalau fitur Places realtime ditambahkan nanti.
          </div>
          {locationStatus && (
            <div className="text-xs text-primary mt-2" data-testid="bank-location-status">
              {locationStatus}
            </div>
          )}
          {nearestBank && (
            <div className="text-xs text-foreground/75 mt-2" data-testid="bank-nearest-summary">
              Terdekat: <span className="font-semibold">{nearestBank.name}</span> -{" "}
              {Number(nearestBank.distance_km).toFixed(1)} km
            </div>
          )}
          {error && (
            <div className="text-xs text-destructive mt-2" data-testid="bank-google-error">
              {error}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => loadBanks()}
            className="rounded border border-border bg-card text-foreground hover:border-primary font-semibold px-4 py-2.5 text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Muat ulang
          </button>
          <button
            type="button"
            onClick={locateUser}
            data-testid="bank-locate-nearest"
            className="rounded bg-primary hover:bg-secondary text-primary-foreground font-semibold px-4 py-2.5 text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <LocateFixed className="w-4 h-4" /> Cari dekat saya
          </button>
        </div>
      </div>

      {view === "map" ? (
        <MapView banks={banks} onSelect={setPicked} userLocation={userLocation} loading={loading} />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 rounded bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : banks.length === 0 ? (
        <EmptyState
          icon={MapPinOff}
          title="Belum ada hasil"
          description="Coba kata kunci lain atau aktifkan lokasi perangkat."
        />
      ) : (
        <div className="space-y-2.5">
          <div className="kicker pb-1">Menampilkan {banks.length} bank sampah</div>
          {banks.map((bank) => (
            <WasteBankCard key={bank.id} bank={bank} onSelect={setPicked} />
          ))}
        </div>
      )}

      <WasteBankModal bank={picked} onClose={() => setPicked(null)} />
    </div>
  );
}

function MapView({ banks, onSelect, userLocation, loading }) {
  const nearest = banks.find((bank) => bank.distance_km !== null && bank.distance_km !== undefined);
  const mapTarget = nearest || banks[0];
  const mapUrl = mapTarget
    ? googlePlaceEmbedUrl(mapTarget)
    : `https://www.google.com/maps?q=${encodeURIComponent(`bank sampah ${DEFAULT_AREA}`)}&z=13&output=embed`;
  const directionsUrl = nearest
    ? nearest.external_id
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(nearest.name)}&destination_place_id=${nearest.external_id}`
      : `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${nearest.lat},${nearest.lng}`
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded border border-border overflow-hidden bg-muted">
        <iframe
          title="Peta Bank Sampah"
          data-testid="bank-map-iframe"
          src={mapUrl}
          width="100%"
          height="380"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          data-testid="bank-nearest-directions"
          className="rounded border border-primary/30 bg-primary/8 px-4 py-3 text-sm font-semibold text-primary inline-flex items-center gap-2 hover:bg-primary/12 transition-colors"
        >
          <LocateFixed className="w-4 h-4" /> Buka rute ke {nearest.name}
        </a>
      )}

      {loading ? (
        <div className="h-24 rounded bg-card border border-border animate-pulse" />
      ) : (
        <div className="space-y-2.5">
          {banks.map((bank) => (
            <WasteBankCard key={bank.id} bank={bank} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
