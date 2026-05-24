// WhatsApp deep link helper
// Indonesian numbers expected as 08xxxx or +628xxxx -> normalize to 628xxxx
export function normalizeWaNumber(raw) {
  if (!raw) return "";
  let n = String(raw).replace(/[^0-9+]/g, "");
  if (n.startsWith("+")) n = n.slice(1);
  if (n.startsWith("0")) n = "62" + n.slice(1);
  if (n.startsWith("8")) n = "62" + n;
  return n;
}

export function waLink(number, message = "") {
  const num = normalizeWaNumber(number);
  const url = `https://wa.me/${num}`;
  if (!message) return url;
  return `${url}?text=${encodeURIComponent(message)}`;
}

export function defaultPickupMessage(vendorName) {
  return `Halo ${vendorName}, saya menemukan kontak Anda di Pilah.in. Saya ingin menanyakan jadwal pengambilan sampah daur ulang. Terima kasih.`;
}

export function defaultBankMessage(bankName) {
  return `Halo ${bankName}, saya menemukan info Anda di Pilah.in. Saya ingin menanyakan tentang penyetoran sampah. Terima kasih.`;
}
