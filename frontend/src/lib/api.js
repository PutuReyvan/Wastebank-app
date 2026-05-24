import axios from "axios";
import { wasteTypes as mockWasteTypes } from "@/lib/mockData";

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
