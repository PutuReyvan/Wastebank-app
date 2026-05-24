import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format integer/decimal as Indonesian Rupiah, e.g. 1500 -> "Rp 1.500"
export function formatRp(amount, opts = {}) {
  const { withSuffix = false } = opts;
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "Rp 0";
  }
  const rounded = Math.round(Number(amount));
  const withDots = rounded.toLocaleString("id-ID");
  return withSuffix ? `Rp ${withDots}/kg` : `Rp ${withDots}`;
}

// Indonesian relative time, e.g. "2 hari yang lalu"
export function formatRelativeId(isoString) {
  if (!isoString) return "";
  const then = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam yang lalu`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} hari yang lalu`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `${diffMo} bulan yang lalu`;
  const diffYr = Math.floor(diffMo / 12);
  return `${diffYr} tahun yang lalu`;
}

export function formatDateId(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
