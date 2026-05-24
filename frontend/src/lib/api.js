import axios from "axios";
import {
  wasteTypes as mockWasteTypes,
  wasteBanks as mockWasteBanks,
} from "@/lib/mockData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API_BASE = `${BACKEND_URL}/api`;
const USE_REAL_API = process.env.REACT_APP_USE_REAL_API === "true";

const http = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

function paginate(items, page = 1, perPage = 100) {
  const start = (page - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: {
      page: Number(page),
      per_page: Number(perPage),
      total: items.length,
    },
  };
}

function attachAccepted(bank) {
  const accepted_types = (bank.catalog || []).map((catalog) => {
    const wasteType = mockWasteTypes.find((type) => type.id === catalog.waste_type_id);
    return {
      waste_type_id: catalog.waste_type_id,
      name: wasteType?.name || "Unknown",
      category: wasteType?.category || "",
      price_per_kg: catalog.price_per_kg,
      updated_at: catalog.updated_at,
    };
  });
  const { catalog, ...rest } = bank;
  return { ...rest, accepted_types };
}

export async function getWasteTypes({ category, is_eligible } = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/waste-types", { params: { category, is_eligible } });
    return res.data;
  }

  let items = [...mockWasteTypes];
  if (category && category !== "Semua") {
    items = items.filter((wasteType) => wasteType.category === category);
  }
  if (is_eligible !== undefined) {
    items = items.filter((wasteType) => wasteType.is_eligible === is_eligible);
  }
  return paginate(items);
}

export async function getWasteType(id) {
  if (USE_REAL_API) {
    const res = await http.get(`/waste-types/${id}`);
    return res.data;
  }

  const item = mockWasteTypes.find((wasteType) => wasteType.id === Number(id));
  if (!item) throw new Error("Tipe sampah tidak ditemukan");
  return { data: item };
}

export async function calculateEstimate({ items }) {
  if (USE_REAL_API) {
    const res = await http.post("/calculator", { items });
    return res.data;
  }

  const breakdown = [];
  let total = 0;

  for (const item of items || []) {
    const wasteType = mockWasteTypes.find((type) => type.id === Number(item.waste_type_id));

    if (!wasteType) {
      throw new Error(`Tipe sampah ID ${item.waste_type_id} tidak ditemukan`);
    }

    if (!wasteType.is_eligible) {
      throw new Error(`${wasteType.name} tidak diterima bank sampah pada umumnya`);
    }

    const weight = Number(item.weight_kg) || 0;
    const price = Number(wasteType.reference_price_per_kg) || 0;
    const subtotal = weight * price;

    breakdown.push({
      waste_type_id: wasteType.id,
      name: wasteType.name,
      category: wasteType.category,
      weight_kg: weight,
      price_per_kg: price,
      subtotal,
    });
    total += subtotal;
  }

  return {
    data: {
      items: breakdown,
      total_estimated: total,
    },
  };
}

export async function getWasteBanks({ waste_type_id, kecamatan, search } = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/waste-banks", {
      params: { waste_type_id, kecamatan, search },
    });
    return res.data;
  }

  let items = mockWasteBanks.filter((bank) => bank.is_active);
  if (waste_type_id) {
    const id = Number(waste_type_id);
    items = items.filter((bank) => bank.catalog.some((catalog) => catalog.waste_type_id === id));
  }
  if (kecamatan && kecamatan !== "Semua") {
    items = items.filter((bank) => bank.kecamatan === kecamatan);
  }
  if (search) {
    const value = search.toLowerCase();
    items = items.filter(
      (bank) =>
        bank.name.toLowerCase().includes(value) ||
        bank.address.toLowerCase().includes(value) ||
        bank.kecamatan.toLowerCase().includes(value),
    );
  }

  return paginate(items.map(attachAccepted));
}

export async function getGoogleWasteBanks({ search } = {}) {
  return getWasteBanks({ search });
}

export async function getWasteBank(id) {
  if (USE_REAL_API) {
    const res = await http.get(`/waste-banks/${id}`);
    return res.data;
  }

  const bank = mockWasteBanks.find((item) => item.id === Number(id));
  if (!bank) throw new Error("Bank sampah tidak ditemukan");
  return { data: attachAccepted(bank) };
}

export function getKecamatanList() {
  const values = new Set(mockWasteBanks.map((bank) => bank.kecamatan));
  return ["Semua", ...Array.from(values).sort()];
}
