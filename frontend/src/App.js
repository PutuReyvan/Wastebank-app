import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Katalog from "@/pages/Katalog";
import KatalogDetail from "@/pages/KatalogDetail";
import Kalkulator from "@/pages/Kalkulator";
import BankSampah from "@/pages/BankSampah";
import BankSampahDetail from "@/pages/BankSampahDetail";
import Vendor from "@/pages/Vendor";
import VendorDetail from "@/pages/VendorDetail";
import Panduan from "@/pages/Panduan";
import PanduanDetail from "@/pages/PanduanDetail";
import BankLogin from "@/pages/BankLogin";
import BankDashboard from "@/pages/BankDashboard";
import AdminInfo from "@/pages/AdminInfo";
import NotFound from "@/pages/NotFound";

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

            <Route path="/vendor" element={<Vendor />} />
            <Route path="/vendor/:id" element={<VendorDetail />} />

            <Route path="/panduan" element={<Panduan />} />
            <Route path="/panduan/:id" element={<PanduanDetail />} />

            <Route path="/login" element={<BankLogin />} />
            <Route path="/dashboard" element={<BankDashboard />} />
            <Route path="/admin" element={<AdminInfo />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
