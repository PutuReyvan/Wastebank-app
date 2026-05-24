import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import Katalog from "@/pages/Katalog";
import KatalogDetail from "@/pages/KatalogDetail";
import Kalkulator from "@/pages/Kalkulator";
import BankSampah from "@/pages/BankSampah";
import BankSampahDetail from "@/pages/BankSampahDetail";
import Panduan from "@/pages/Panduan";
import PanduanDetail from "@/pages/PanduanDetail";
import NotFound from "@/pages/NotFound";
import PriceList from "@/pages/PriceList";

function Home() {
  return (
    <div className="space-y-5">
      <div className="kicker">Bank Sampah ID</div>
      <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
        Baseline awal untuk katalog sampah, kalkulator, direktori bank sampah, lokasi, dan price list.
      </h1>
      <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
        Fitur katalog, kalkulator, direktori bank sampah, integrasi lokasi, dan price list sudah tersedia sebagai baseline awal.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/katalog/:id" element={<KatalogDetail />} />
            <Route path="/kalkulator" element={<Kalkulator />} />
            <Route path="/bank-sampah" element={<BankSampah />} />
            <Route path="/bank-sampah/:id" element={<BankSampahDetail />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/panduan" element={<Panduan />} />
            <Route path="/panduan/:id" element={<PanduanDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
