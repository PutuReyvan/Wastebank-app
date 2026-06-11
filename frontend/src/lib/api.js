// Unified API client. Tries the real Laravel backend (when available) and
// transparently falls back to mock data so the FE can be developed independently.
//
// Endpoints follow the public API contract defined in the project brief.

import axios from "axios";
import {
  wasteTypes as mockWasteTypes,
  wasteBanks as mockWasteBanks,
  vendors as mockVendors,
  guides as mockGuides,
  mockBankUsers,
} from "@/lib/mockData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API_BASE = `${BACKEND_URL}/api`;

// Toggle to true once the Laravel API is live. Override via REACT_APP_USE_REAL_API=true.
const USE_REAL_API = process.env.REACT_APP_USE_REAL_API === "true";

const http = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

const CACHE_TTL_MS = 5 * 60 * 1000;
const memoryCache = new Map();
const inflight = new Map();

// ---------- helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getCached(key) {
  const cached = memoryCache.get(key);
  if (!cached || Date.now() - cached.timestamp > CACHE_TTL_MS) return null;
  return cached.value;
}

function setCached(key, value) {
  memoryCache.set(key, { timestamp: Date.now(), value });
  return value;
}

async function cachedRequest(key, request) {
  const cached = getCached(key);
  if (cached) return cached;
  if (inflight.has(key)) return inflight.get(key);

  const promise = request()
    .then((value) => setCached(key, value))
    .finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}

function paginate(items, page = 1, perPage = 50) {
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
  // Convert internal `catalog` (waste_type_id, price_per_kg, updated_at) into
  // accepted_types[] (waste_type_id, name, price_per_kg, updated_at) per API contract.
  const accepted_types = (bank.catalog || []).map((c) => {
    const wt = mockWasteTypes.find((w) => w.id === c.waste_type_id);
    return {
      waste_type_id: c.waste_type_id,
      name: wt ? wt.name : "Unknown",
      category: wt ? wt.category : "",
      price_per_kg: c.price_per_kg,
      updated_at: c.updated_at,
    };
  });
  // eslint-disable-next-line no-unused-vars
  const { catalog, ...rest } = bank;
  return { ...rest, accepted_types };
}

// ---------- public API ----------

export async function getWasteTypes({ category, is_eligible } = {}) {
  if (USE_REAL_API) {
    const response = await cachedRequest("waste-types:all", async () => {
      const res = await http.get("/waste-types");
      return res.data;
    });

    let items = [...(response.data || [])];
    if (category && category !== "Semua") {
      items = items.filter((w) => w.category === category);
    }
    if (is_eligible !== undefined) {
      const wanted = String(is_eligible) === "true" || is_eligible === true;
      items = items.filter((w) => Boolean(w.is_eligible) === wanted);
    }
    return { data: items, meta: { ...(response.meta || {}), total: items.length } };
  }
  await sleep(80);
  let items = [...mockWasteTypes];
  if (category && category !== "Semua")
    items = items.filter((w) => w.category === category);
  if (is_eligible !== undefined) items = items.filter((w) => w.is_eligible === is_eligible);
  return paginate(items, 1, 100);
}

export async function getWasteType(id) {
  if (USE_REAL_API) {
    const cached = getCached("waste-types:all");
    const item = cached?.data?.find((w) => String(w.id) === String(id));
    if (item) return { data: item };

    const res = await http.get(`/waste-types/${id}`);
    return res.data;
  }
  await sleep(50);
  const item = mockWasteTypes.find((w) => w.id === Number(id));
  if (!item) throw new Error("Tipe sampah tidak ditemukan");
  return { data: item };
}

export async function calculateEstimate({ items }) {
  if (USE_REAL_API) {
    const res = await http.post("/calculator", { items });
    return res.data;
  }
  await sleep(120);
  const breakdown = [];
  let total = 0;
  for (const item of items || []) {
    const wt = mockWasteTypes.find((w) => w.id === Number(item.waste_type_id));
    if (!wt) {
      throw new Error(`Tipe sampah ID ${item.waste_type_id} tidak ditemukan`);
    }
    if (!wt.is_eligible) {
      throw new Error(`${wt.name} tidak diterima bank sampah pada umumnya`);
    }
    const weight = Number(item.weight_kg) || 0;
    const subtotal = weight * wt.reference_price_per_kg;
    breakdown.push({
      waste_type_id: wt.id,
      name: wt.name,
      category: wt.category,
      weight_kg: weight,
      price_per_kg: wt.reference_price_per_kg,
      subtotal,
    });
    total += subtotal;
  }
  return { data: { items: breakdown, total_estimated: total } };
}

export async function getWasteBanks({
  waste_type_id,
  kecamatan,
  search,
} = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/waste-banks", {
      params: { waste_type_id, kecamatan, search },
    });
    return res.data;
  }
  await sleep(80);
  let items = mockWasteBanks.filter((b) => b.is_active);
  if (waste_type_id) {
    const id = Number(waste_type_id);
    items = items.filter((b) => b.catalog.some((c) => c.waste_type_id === id));
  }
  if (kecamatan && kecamatan !== "Semua") {
    items = items.filter((b) => b.kecamatan === kecamatan);
  }
  if (search) {
    const s = search.toLowerCase();
    items = items.filter(
      (b) =>
        b.name.toLowerCase().includes(s) ||
        b.address.toLowerCase().includes(s) ||
        b.kecamatan.toLowerCase().includes(s),
    );
  }
  return paginate(items.map(attachAccepted), 1, 100);
}

export async function getGoogleWasteBanks({
  lat,
  lng,
  radius,
  search,
  area,
} = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/google/waste-banks", {
      params: { lat, lng, radius, search, area },
    });
    return res.data;
  }

  await sleep(80);
  return paginate(mockWasteBanks.filter((b) => b.is_active).map(attachAccepted), 1, 100);
}

export async function getWasteBank(id) {
  if (USE_REAL_API) {
    const res = await http.get(`/waste-banks/${id}`);
    return res.data;
  }
  await sleep(60);
  const bank = mockWasteBanks.find((b) => b.id === Number(id));
  if (!bank) throw new Error("Bank sampah tidak ditemukan");
  return { data: attachAccepted(bank) };
}

export async function getVendors({ area, waste_type_id, type } = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/vendors", {
      params: { area, waste_type_id, type },
    });
    return res.data;
  }
  await sleep(80);
  let items = mockVendors.filter((v) => v.is_active);
  if (area && area !== "Semua") {
    items = items.filter((v) =>
      v.service_area.toLowerCase().includes(area.toLowerCase()),
    );
  }
  if (waste_type_id) {
    const id = Number(waste_type_id);
    items = items.filter((v) => v.waste_type_ids.includes(id));
  }
  if (type && type !== "Semua") {
    items = items.filter((v) => v.type === type);
  }
  // Add accepted_waste_types[] per contract
  const enriched = items.map((v) => ({
    ...v,
    accepted_waste_types: v.waste_type_ids.map((id) => {
      const wt = mockWasteTypes.find((w) => w.id === id);
      return wt ? { id: wt.id, name: wt.name, category: wt.category } : null;
    }).filter(Boolean),
  }));
  return paginate(enriched, 1, 100);
}

export async function getVendor(id) {
  if (USE_REAL_API) {
    const res = await http.get(`/vendors/${id}`);
    return res.data;
  }
  await sleep(50);
  const v = mockVendors.find((x) => x.id === Number(id));
  if (!v) throw new Error("Vendor tidak ditemukan");
  return {
    data: {
      ...v,
      accepted_waste_types: v.waste_type_ids
        .map((id) => mockWasteTypes.find((w) => w.id === id))
        .filter(Boolean),
    },
  };
}

export async function getGuides({ waste_type_id } = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/guides", { params: { waste_type_id } });
    return res.data;
  }
  await sleep(60);
  let items = [...mockGuides].sort(
    (a, b) => new Date(b.published_at) - new Date(a.published_at),
  );
  if (waste_type_id) {
    items = items.filter((g) => g.waste_type_id === Number(waste_type_id));
  }
  return paginate(items, 1, 100);
}

export async function getGuide(id) {
  if (USE_REAL_API) {
    const res = await http.get(`/guides/${id}`);
    return res.data;
  }
  await sleep(50);
  const g = mockGuides.find((x) => x.id === Number(id));
  if (!g) throw new Error("Panduan tidak ditemukan");
  return { data: g };
}

export async function getPriceSources() {
  if (USE_REAL_API) {
    const res = await http.get("/price-sources");
    return res.data;
  }
  await sleep(50);
  return { data: [], meta: { total: 0 } };
}

export async function getExternalPrices({ source, category, search } = {}) {
  if (USE_REAL_API) {
    const res = await http.get("/external-prices", {
      params: { source, category, search },
    });
    return res.data;
  }
  await sleep(50);
  return { data: [], meta: { total: 0 } };
}

// ---------- waste bank auth (mock) ----------

export async function loginWasteBank({ email, password }) {
  if (USE_REAL_API) {
    const res = await http.post("/waste-bank/login", { email, password });
    return res.data;
  }
  await sleep(200);
  const user = mockBankUsers.find(
    (u) => u.email === email && u.password === password,
  );
  if (!user) {
    throw new Error("Email atau kata sandi salah");
  }
  const bank = mockWasteBanks.find((b) => b.id === user.waste_bank_id);
  return {
    data: {
      token: `mock-${user.id}-${Date.now()}`,
      waste_bank_id: user.waste_bank_id,
      bank: attachAccepted(bank),
    },
  };
}

export async function updateWasteBankProfile(bankId, payload) {
  if (USE_REAL_API) {
    const res = await http.patch(`/waste-bank/profile`, payload);
    return res.data;
  }
  await sleep(150);
  const bank = mockWasteBanks.find((b) => b.id === Number(bankId));
  if (!bank) throw new Error("Bank sampah tidak ditemukan");
  Object.assign(bank, payload);
  return { data: attachAccepted(bank) };
}

export async function replaceWasteBankCatalog(bankId, catalog) {
  if (USE_REAL_API) {
    const res = await http.post(`/waste-bank/catalog`, { catalog });
    return res.data;
  }
  await sleep(150);
  const bank = mockWasteBanks.find((b) => b.id === Number(bankId));
  if (!bank) throw new Error("Bank sampah tidak ditemukan");
  const now = new Date().toISOString();
  bank.catalog = (catalog || []).map((c) => ({
    waste_type_id: Number(c.waste_type_id),
    price_per_kg: Number(c.price_per_kg),
    updated_at: now,
  }));
  return { data: attachAccepted(bank) };
}

// Distinct kecamatan list, useful for filter dropdowns.
export function getKecamatanList() {
  const set = new Set(mockWasteBanks.map((b) => b.kecamatan));
  return ["Semua", ...Array.from(set).sort()];
}
