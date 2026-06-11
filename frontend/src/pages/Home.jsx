import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calculator, MapPin, MessageCircle, Search, ArrowRight } from "lucide-react";
import * as api from "@/lib/api";
import { WasteTypeRow } from "@/components/WasteTypeCard";
import WasteBankCard from "@/components/WasteBankCard";
import GuideCard from "@/components/GuideCard";
import WasteTypeModal from "@/components/WasteTypeModal";
import WasteBankModal from "@/components/WasteBankModal";
import {
  WasteBankCardSkeleton,
  GuideCardSkeleton,
  WasteTypeRowSkeleton,
  StatSkeleton,
} from "@/components/SkeletonCards";

export default function Home() {
  const [banks, setBanks] = useState([]);
  const [guides, setGuides] = useState([]);
  const [hot, setHot] = useState([]);
  const [stats, setStats] = useState({ types: 0, banks: 0, vendors: 0, guides: 0 });
  const [pickedType, setPickedType] = useState(null);
  const [pickedBank, setPickedBank] = useState(null);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [loadingHot, setLoadingHot] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    api
      .getGoogleWasteBanks({ search: "bank sampah", area: "Jakarta Barat" })
      .then((r) => {
        setBanks((r.data || []).slice(0, 5));
        setStats((s) => ({ ...s, banks: r.meta?.total || 0 }));
      })
      .catch(() => {
        setBanks([]);
        setStats((s) => ({ ...s, banks: 0 }));
      })
      .finally(() => setLoadingBanks(false));
    api.getGuides().then((r) => {
      setGuides(r.data.slice(0, 3));
      setStats((s) => ({ ...s, guides: r.meta.total }));
    }).finally(() => setLoadingGuides(false));
    api.getVendors().then((r) => setStats((s) => ({ ...s, vendors: r.meta.total })));
    api.getWasteTypes().then((r) => {
      setStats((s) => ({ ...s, types: r.meta.total }));
      const top = [...r.data]
        .filter((w) => w.is_eligible)
        .sort((a, b) => b.reference_price_per_kg - a.reference_price_per_kg)
        .slice(0, 5);
      setHot(top);
    }).finally(() => {
      setLoadingHot(false);
      setLoadingStats(false);
    });
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 items-start">
        <div>
          <div className="kicker mb-3">Pilah.in</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Cek estimasi harga, cari bank sampah, hubungi pickup -{" "}
            <span className="text-primary">semua dalam satu tempat.</span>
          </h1>
          <p className="text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            Direktori publik untuk membantu warga melihat estimasi nilai sampah,
            menemukan lokasi bank sampah realtime dari Google Maps, dan menghubungi jasa pickup.
            Tanpa daftar, gratis untuk umum.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/kalkulator"
              data-testid="hero-cta-kalkulator"
              className="inline-flex items-center gap-2 rounded bg-primary hover:bg-secondary text-primary-foreground font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              <Calculator className="w-4 h-4" /> Cek Estimasi Sampahmu
            </Link>
            <Link
              to="/katalog"
              data-testid="hero-cta-katalog"
              className="inline-flex items-center gap-2 rounded border border-border bg-card hover:border-primary hover:text-primary text-foreground font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              Lihat Katalog Referensi
            </Link>
          </div>
        </div>

        <div className="relative rounded border border-border overflow-hidden bg-muted aspect-[4/5] md:aspect-[4/5] order-first md:order-last">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
            alt="Tangan memegang daun hijau sebagai simbol daur ulang"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
            <div className="text-[10px] font-mono uppercase tracking-wider opacity-90">
              Foto - Daur Ulang
            </div>
            <p className="font-semibold text-sm md:text-base mt-1 leading-snug">
              Sampah yang dipilah dengan benar lebih mudah diterima dan dinilai.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded overflow-hidden border border-border">
          {loadingStats ? (
            Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <Stat label="Jenis Sampah" value={stats.types} suffix="jenis" />
              <Stat label="Lokasi Google Maps" value={stats.banks} suffix="bank" />
              <Stat label="Vendor Pickup" value={stats.vendors} suffix="vendor" />
              <Stat label="Panduan" value={stats.guides} suffix="artikel" />
            </>
          )}
        </div>
      </section>

      <section>
        <SectionHeader code="01" title="Tiga pertanyaan sederhana" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded overflow-hidden border border-border">
          <ServiceItem
            to="/kalkulator"
            num="A"
            title="Berapa estimasinya?"
            desc="Hitung perkiraan nilai sampahmu dengan kalkulator multi-jenis."
            icon={Calculator}
            testId="quick-action-kalkulator"
          />
          <ServiceItem
            to="/bank-sampah"
            num="B"
            title="Setor ke mana?"
            desc="Temukan bank sampah terdekat dari data Google Maps."
            icon={MapPin}
            testId="quick-action-bank"
          />
          <ServiceItem
            to="/vendor"
            num="C"
            title="Siapa yang ambil?"
            desc="Lihat referensi vendor pickup atau NGO."
            icon={MessageCircle}
            testId="quick-action-vendor"
          />
        </div>
      </section>

      <section>
        <SectionHeader
          code="02"
          title="Estimasi referensi tertinggi"
          right={
            <Link
              to="/katalog"
              data-testid="row-hot-prices-see-all"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Semua jenis <ArrowRight className="w-3 h-3" />
            </Link>
          }
        />
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
              {loadingHot
                ? Array.from({ length: 5 }).map((_, i) => <WasteTypeRowSkeleton key={i} />)
                : hot.map((item) => (
                    <WasteTypeRow key={item.id} item={item} onSelect={setPickedType} />
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader
          code="03"
          title="Bank sampah terdekat"
          right={
            <Link
              to="/bank-sampah"
              data-testid="row-featured-banks-see-all"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Semua bank <ArrowRight className="w-3 h-3" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loadingBanks
            ? Array.from({ length: 4 }).map((_, i) => <WasteBankCardSkeleton key={i} />)
            : banks.map((bank) => (
                <WasteBankCard key={bank.id} bank={bank} onSelect={setPickedBank} />
              ))}
        </div>
      </section>

      <section>
        <SectionHeader
          code="04"
          title="Panduan daur ulang"
          right={
            <Link
              to="/panduan"
              data-testid="row-guides-see-all"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Semua panduan <ArrowRight className="w-3 h-3" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {loadingGuides
            ? Array.from({ length: 3 }).map((_, i) => <GuideCardSkeleton key={i} />)
            : guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
        </div>
      </section>

      <section className="rounded border border-border bg-primary/5 p-5 md:p-6">
        <div className="flex items-start gap-4">
          <Search className="w-5 h-5 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-foreground">Tentang Pilah.in</h3>
            <p className="text-sm text-foreground/75 mt-1.5 leading-relaxed">
              Platform ini adalah <strong>direktori publik</strong>, bukan marketplace. Semua transaksi dilakukan
              langsung antara warga dan bank sampah / vendor - kami tidak mengambil komisi atau menahan dana.
              Lokasi bank sampah diambil dari Google Maps, sementara harga katalog adalah estimasi referensi.
            </p>
          </div>
        </div>
      </section>

      <WasteTypeModal item={pickedType} onClose={() => setPickedType(null)} />
      <WasteBankModal bank={pickedBank} onClose={() => setPickedBank(null)} />
    </div>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div className="bg-card px-4 py-4">
      <div className="kicker">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl md:text-3xl font-extrabold tabular-nums text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

function SectionHeader({ code, title, right }) {
  return (
    <div className="flex items-end justify-between mb-4 pb-2 border-b border-border">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{code}</span>
        <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function ServiceItem({ to, num, title, desc, icon: Icon, testId }) {
  return (
    <Link
      to={to}
      data-testid={testId}
      className="bg-card hover:bg-muted transition-colors p-5 group"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="font-mono text-[11px] text-muted-foreground">{num}</span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
      <div className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Buka <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
