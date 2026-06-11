// Mock data shaped exactly per /api contract & DB schema in problem statement.
// All currency values are integers in Rupiah per kg.
// Used by /lib/api.js as fallback when the real API is not available yet.

export const wasteTypes = [
  // Plastik
  {
    id: 1,
    name: "Botol PET Bening",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 4500,
    description:
      "Botol minuman bening dari bahan PET. Dijual mahal jika bersih, kering, dan label dilepas.",
    icon: "Bottle",
    guide_id: 1,
  },
  {
    id: 2,
    name: "Botol Plastik Berwarna",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 2500,
    description: "Botol plastik bekas minuman atau pembersih dengan warna.",
    icon: "Bottle",
    guide_id: 1,
  },
  {
    id: 3,
    name: "Plastik Kresek (HDPE/LDPE)",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 800,
    description: "Kantong plastik belanjaan, bersih dan kering.",
    icon: "ShoppingBag",
    guide_id: 1,
  },
  {
    id: 4,
    name: "Gelas Plastik",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 3000,
    description: "Gelas plastik bekas minuman, label dilepas.",
    icon: "Cup",
    guide_id: 1,
  },
  // Kertas
  {
    id: 5,
    name: "Kardus",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 2200,
    description: "Kardus bekas paket atau dus elektronik. Harus kering.",
    icon: "Package",
    guide_id: 2,
  },
  {
    id: 6,
    name: "Koran Bekas",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 2800,
    description: "Koran bekas dalam kondisi kering dan tidak basah.",
    icon: "Newspaper",
    guide_id: 2,
  },
  {
    id: 7,
    name: "Buku/HVS",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 2000,
    description: "Buku, majalah, atau kertas HVS bekas.",
    icon: "BookOpen",
    guide_id: 2,
  },
  {
    id: 8,
    name: "Duplex",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 1200,
    description: "Karton dua lapis bekas kemasan makanan.",
    icon: "FileBox",
    guide_id: 2,
  },
  // Logam
  {
    id: 9,
    name: "Kaleng Aluminium",
    category: "Logam",
    is_eligible: true,
    reference_price_per_kg: 14000,
    description: "Kaleng minuman ringan, bir, dll.",
    icon: "Beer",
    guide_id: 3,
  },
  {
    id: 10,
    name: "Besi Bekas",
    category: "Logam",
    is_eligible: true,
    reference_price_per_kg: 4500,
    description: "Potongan besi rumahan, paku, jeruji.",
    icon: "Wrench",
    guide_id: 3,
  },
  {
    id: 11,
    name: "Tembaga",
    category: "Logam",
    is_eligible: true,
    reference_price_per_kg: 75000,
    description: "Kabel tembaga atau pipa tembaga bekas.",
    icon: "Cable",
    guide_id: 3,
  },
  // Kaca
  {
    id: 12,
    name: "Botol Kaca Bening",
    category: "Kaca",
    is_eligible: true,
    reference_price_per_kg: 500,
    description: "Botol kecap, sirup, atau saus dari kaca bening.",
    icon: "Wine",
    guide_id: 4,
  },
  {
    id: 13,
    name: "Botol Kaca Warna",
    category: "Kaca",
    is_eligible: true,
    reference_price_per_kg: 300,
    description: "Botol kaca berwarna hijau atau cokelat.",
    icon: "Wine",
    guide_id: 4,
  },
  // Elektronik
  {
    id: 14,
    name: "Limbah Elektronik (E-waste)",
    category: "Elektronik",
    is_eligible: true,
    reference_price_per_kg: 6000,
    description:
      "Komputer, ponsel, charger, baterai bekas. Wajib dikumpulkan terpisah.",
    icon: "Cpu",
    guide_id: 5,
  },
  // Organik (tidak eligible untuk dijual ke bank sampah pada umumnya)
  {
    id: 15,
    name: "Sampah Organik",
    category: "Organik",
    is_eligible: false,
    reference_price_per_kg: 0,
    description:
      "Sisa makanan, daun, kulit buah. Tidak diterima bank sampah, tapi bisa untuk kompos rumah.",
    icon: "Leaf",
    guide_id: 6,
  },
  {
    id: 16,
    name: "Styrofoam",
    category: "Plastik",
    is_eligible: false,
    reference_price_per_kg: 0,
    description: "Tidak banyak diterima, sebaiknya kurangi pemakaian.",
    icon: "Box",
    guide_id: 1,
  },
];

export const wasteCategories = [
  "Semua",
  "Kaca",
  "Kertas",
  "Logam",
  "Plastik",
];

// Helper: build catalog entries (waste_bank_catalog) for a bank.
// Each entry: { waste_type_id, price_per_kg, updated_at }
const cat = (waste_type_id, price_per_kg, updated_at) => ({
  waste_type_id,
  price_per_kg,
  updated_at,
});

const FRESH = "2026-01-08T09:00:00+07:00";
const WEEK = "2025-12-30T09:00:00+07:00";
const MONTH = "2025-12-08T09:00:00+07:00";

export const wasteBanks = [
  {
    id: 1,
    name: "Bank Sampah Melati Bersih",
    address: "Jl. Kembangan Raya No. 12, Kembangan Selatan, Kembangan",
    kelurahan: "Kembangan Selatan",
    kecamatan: "Kembangan",
    kota: "Jakarta Barat",
    lat: -6.1944,
    lng: 106.7421,
    phone: "021-58901234",
    whatsapp: "081234567801",
    operating_hours: "Sen–Sab, 08.00–16.00",
    photo_url:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4800, FRESH),
      cat(3, 900, FRESH),
      cat(5, 2300, FRESH),
      cat(6, 3000, FRESH),
      cat(9, 14500, WEEK),
      cat(12, 500, MONTH),
    ],
  },
  {
    id: 2,
    name: "Bank Sampah Hijau Lestari",
    address: "Jl. Daan Mogot Km. 14, Cengkareng Timur, Cengkareng",
    kelurahan: "Cengkareng Timur",
    kecamatan: "Cengkareng",
    kota: "Jakarta Barat",
    lat: -6.1456,
    lng: 106.7261,
    phone: "021-54321009",
    whatsapp: "081234567802",
    operating_hours: "Sen–Jum, 09.00–15.00",
    photo_url:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4500, FRESH),
      cat(2, 2500, FRESH),
      cat(5, 2200, WEEK),
      cat(7, 2000, WEEK),
      cat(10, 4600, MONTH),
      cat(14, 6500, MONTH),
    ],
  },
  {
    id: 3,
    name: "Bank Sampah Kebon Jeruk Sejahtera",
    address: "Jl. Pos Pengumben No. 45, Sukabumi Utara, Kebon Jeruk",
    kelurahan: "Sukabumi Utara",
    kecamatan: "Kebon Jeruk",
    kota: "Jakarta Barat",
    lat: -6.1908,
    lng: 106.7726,
    phone: "021-53651122",
    whatsapp: "081234567803",
    operating_hours: "Sen–Sab, 07.30–16.00",
    photo_url:
      "https://images.unsplash.com/photo-1572125675722-238a4f1f8ea7?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4700, FRESH),
      cat(3, 850, FRESH),
      cat(4, 3100, FRESH),
      cat(5, 2300, WEEK),
      cat(6, 2900, WEEK),
      cat(9, 14000, WEEK),
      cat(11, 76000, MONTH),
    ],
  },
  {
    id: 4,
    name: "Bank Sampah Palmerah Mandiri",
    address: "Jl. Palmerah Barat No. 88, Palmerah, Palmerah",
    kelurahan: "Palmerah",
    kecamatan: "Palmerah",
    kota: "Jakarta Barat",
    lat: -6.2055,
    lng: 106.7912,
    phone: "021-53699988",
    whatsapp: "081234567804",
    operating_hours: "Sen–Jum, 08.00–17.00",
    photo_url:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4400, WEEK),
      cat(2, 2400, WEEK),
      cat(5, 2100, MONTH),
      cat(7, 1900, MONTH),
      cat(8, 1200, MONTH),
      cat(13, 300, MONTH),
    ],
  },
  {
    id: 5,
    name: "Bank Sampah Kalideres Asri",
    address: "Jl. Peta Selatan No. 22, Kalideres, Kalideres",
    kelurahan: "Kalideres",
    kecamatan: "Kalideres",
    kota: "Jakarta Barat",
    lat: -6.1394,
    lng: 106.7058,
    phone: "021-54399876",
    whatsapp: "081234567805",
    operating_hours: "Sen–Sab, 08.00–15.00",
    photo_url:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4600, FRESH),
      cat(3, 800, FRESH),
      cat(5, 2200, FRESH),
      cat(6, 2800, FRESH),
      cat(10, 4500, WEEK),
    ],
  },
  {
    id: 6,
    name: "Bank Sampah Tambora Berkah",
    address: "Jl. Jembatan Lima No. 17, Jembatan Lima, Tambora",
    kelurahan: "Jembatan Lima",
    kecamatan: "Tambora",
    kota: "Jakarta Barat",
    lat: -6.1457,
    lng: 106.8123,
    phone: "021-63332100",
    whatsapp: "081234567806",
    operating_hours: "Sen–Jum, 09.00–16.00",
    photo_url:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4500, WEEK),
      cat(2, 2500, WEEK),
      cat(5, 2200, WEEK),
      cat(9, 14200, MONTH),
      cat(12, 500, MONTH),
      cat(13, 300, MONTH),
    ],
  },
  {
    id: 7,
    name: "Bank Sampah Taman Sari Hijau",
    address: "Jl. Mangga Besar Raya No. 30, Maphar, Taman Sari",
    kelurahan: "Maphar",
    kecamatan: "Taman Sari",
    kota: "Jakarta Barat",
    lat: -6.1492,
    lng: 106.8245,
    phone: "021-62345678",
    whatsapp: "081234567807",
    operating_hours: "Sen–Sab, 08.00–16.00",
    photo_url:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4700, FRESH),
      cat(3, 900, FRESH),
      cat(5, 2400, FRESH),
      cat(6, 3000, WEEK),
      cat(9, 14000, WEEK),
      cat(14, 6200, MONTH),
    ],
  },
  {
    id: 8,
    name: "Bank Sampah Grogol Lestari",
    address: "Jl. S. Parman No. 9, Tanjung Duren Selatan, Grogol Petamburan",
    kelurahan: "Tanjung Duren Selatan",
    kecamatan: "Grogol Petamburan",
    kota: "Jakarta Barat",
    lat: -6.1689,
    lng: 106.7912,
    phone: "021-56945612",
    whatsapp: "081234567808",
    operating_hours: "Sen–Jum, 08.30–17.00",
    photo_url:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=70",
    is_active: true,
    catalog: [
      cat(1, 4600, FRESH),
      cat(2, 2500, FRESH),
      cat(4, 3000, FRESH),
      cat(5, 2300, WEEK),
      cat(7, 2100, WEEK),
      cat(11, 75000, MONTH),
    ],
  },
];

export const vendors = [
  {
    id: 1,
    name: "PT Daur Ulang Nusantara",
    type: "business",
    service_area: "Jakarta Barat, Tangerang",
    phone: null,
    whatsapp: null,
    description:
      "Pengepul plastik dan kardus skala menengah. Pickup minimal 50 kg, area Jakarta Barat & sekitarnya.",
    is_active: true,
    waste_type_ids: [1, 2, 3, 4, 5, 6],
    photo_url:
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 2,
    name: "Yayasan Bumi Bersih",
    type: "ngo",
    service_area: "Jakarta Barat",
    phone: null,
    whatsapp: null,
    description:
      "NGO lingkungan yang mengoordinasikan pengambilan sampah elektronik (e-waste) gratis untuk warga.",
    is_active: true,
    waste_type_ids: [14, 11],
    photo_url:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 3,
    name: "Pak Joko Rongsok Jaya",
    type: "business",
    service_area: "Kembangan, Kebon Jeruk, Palmerah",
    phone: null,
    whatsapp: null,
    description:
      "Pengepul rumahan keliling. Bisa pickup harian untuk besi, kardus, koran. Minimal 10 kg.",
    is_active: true,
    waste_type_ids: [5, 6, 7, 9, 10],
    photo_url:
      "https://images.unsplash.com/photo-1587502537745-84b86da1204f?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 4,
    name: "CV Logam Mulya",
    type: "business",
    service_area: "Jakarta Barat, Jakarta Utara",
    phone: null,
    whatsapp: null,
    description:
      "Spesialis logam: besi, tembaga, aluminium. Harga negosiasi untuk volume besar.",
    is_active: true,
    waste_type_ids: [9, 10, 11],
    photo_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: 5,
    name: "Komunitas Bumi Hijau",
    type: "ngo",
    service_area: "Jakarta Barat",
    phone: null,
    whatsapp: null,
    description:
      "Komunitas warga yang membantu warga belajar memilah sampah. Kunjungan edukasi & pickup gratis.",
    is_active: true,
    waste_type_ids: [1, 5, 6, 9],
    photo_url:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=70",
  },
];

export const guides = [
  {
    id: 1,
    title: "Cara Memilah Sampah Plastik agar Bernilai Lebih",
    excerpt:
      "Botol plastik yang bersih dan label terlepas bisa dijual hingga 2x lipat. Begini caranya.",
    waste_type_id: 1,
    cover_image_url:
      "/images/guides/plastic.svg",
    published_at: "2026-01-04T09:00:00+07:00",
    content: `Sampah plastik adalah salah satu jenis sampah yang paling banyak diterima bank sampah di Indonesia. Namun, harganya bisa sangat berbeda tergantung kondisi dan jenis plastiknya.

## Langkah Memilah Plastik

1. **Pisahkan berdasarkan jenis** — PET (botol bening), HDPE (kemasan deterjen), LDPE (kresek), PP (gelas plastik).
2. **Cuci dan keringkan** — Plastik basah/berbau akan ditolak atau dihargai jauh lebih rendah.
3. **Lepas label dan tutup** — Label kertas akan menurunkan kualitas plastik saat didaur ulang.
4. **Tekan untuk hemat tempat** — Mudahkan pengangkutan, dan beberapa bank sampah memberi bonus untuk plastik yang sudah dipres.

## Yang Tidak Diterima

- Styrofoam (sebagian besar bank sampah tidak menerimanya)
- Plastik kemasan multilayer (snack, bumbu instan)
- Plastik yang bercampur makanan basah

## Tips Tambahan

Simpan plastik di tempat kering dan jauhkan dari sinar matahari langsung agar tidak rapuh. Setor minimal 1 minggu sekali agar volume cukup ekonomis.`,
  },
  {
    id: 2,
    title: "Panduan Memilah Kardus dan Kertas",
    excerpt:
      "Kardus kering bernilai lebih tinggi dari koran. Pelajari cara penanganan terbaiknya.",
    waste_type_id: 5,
    cover_image_url:
      "/images/guides/paper.svg",
    published_at: "2026-01-02T09:00:00+07:00",
    content: `Kardus dan kertas adalah komoditas yang stabil di pasar daur ulang.

## Cara Memilah

1. Pisahkan kardus, koran, dan HVS — masing-masing punya harga berbeda.
2. Pastikan benar-benar kering. Kertas basah tidak akan diterima.
3. Lipat kardus agar mudah ditumpuk dan diangkut.
4. Buang isi staples atau lakban besar untuk meningkatkan kualitas.

## Yang Tidak Diterima

- Kertas berlapis lilin (kemasan susu/jus)
- Tisu bekas pakai
- Kertas thermal struk belanja

## Penyimpanan

Simpan di area kering, tidak terkena hujan. Setor sebelum musim hujan jika menyimpan dalam jumlah besar.`,
  },
  {
    id: 3,
    title: "Logam Bekas: Aluminium, Besi, dan Tembaga",
    excerpt:
      "Tembaga adalah logam dengan harga tertinggi di pasar rongsokan. Begini cara mengenalinya.",
    waste_type_id: 9,
    cover_image_url:
      "/images/guides/metal.svg",
    published_at: "2025-12-28T09:00:00+07:00",
    content: `Logam bekas adalah jenis sampah dengan nilai ekonomi tertinggi.

## Tiga Jenis Utama

1. **Aluminium** — Kaleng minuman, panci tipis. Ringan, tidak menempel magnet.
2. **Besi** — Magnetis, paling umum, harga paling rendah dari ketiga jenis.
3. **Tembaga** — Kabel, pipa AC, koil dinamo. Harga paling mahal — bisa Rp 70.000+/kg.

## Tips

- Kupas insulasi kabel untuk mendapatkan tembaga murni (harga lebih tinggi).
- Pastikan tidak basah/berkarat berat untuk besi.
- Pisahkan dari logam lain saat ditimbang.`,
  },
  {
    id: 4,
    title: "Botol Kaca: Apa yang Perlu Anda Tahu",
    excerpt: "Tidak semua bank sampah menerima kaca. Pelajari di mana menyetornya.",
    waste_type_id: 12,
    cover_image_url:
      "/images/guides/glass.svg",
    published_at: "2025-12-22T09:00:00+07:00",
    content: `Botol kaca punya harga yang relatif rendah, tapi tetap bernilai jika dikumpulkan rapi.

## Cara Memilah

- Pisahkan bening, hijau, dan cokelat.
- Lepas tutup logam (jual terpisah sebagai logam).
- Bungkus dengan koran agar tidak pecah saat diangkut.

## Catatan

Banyak bank sampah Jakarta Barat yang sudah tidak menerima kaca karena rendahnya margin. Cek dulu di direktori sebelum membawa.`,
  },
  {
    id: 5,
    title: "E-Waste: Ke Mana Sampah Elektronik Anda?",
    excerpt:
      "Limbah elektronik berbahaya jika dibuang sembarangan. Inilah pilihan amannya.",
    waste_type_id: 14,
    cover_image_url:
      "/images/guides/ewaste.svg",
    published_at: "2025-12-15T09:00:00+07:00",
    content: `Sampah elektronik (e-waste) mengandung logam berat seperti merkuri dan timbal yang berbahaya jika masuk lingkungan.

## Yang Termasuk E-Waste

- Ponsel & charger lama
- Laptop, hard drive, baterai laptop
- Lampu LED & neon (lampu neon mengandung merkuri)
- Adaptor, kabel, casing PC

## Cara Setor

1. Cari NGO atau pengepul khusus e-waste (lihat halaman Vendor → filter Elektronik).
2. Hapus data pribadi dari ponsel/laptop sebelum diserahkan.
3. Banyak NGO menerima gratis untuk volume kecil.`,
  },
  {
    id: 6,
    title: "Memulai Kompos di Rumah dari Sampah Organik",
    excerpt:
      "Sampah organik tidak diterima bank sampah, tapi bisa Anda olah jadi pupuk gratis di rumah.",
    waste_type_id: 15,
    cover_image_url:
      "/images/guides/compost.svg",
    published_at: "2025-12-10T09:00:00+07:00",
    content: `Sampah organik (sisa makanan, kulit buah, daun) adalah 40-60% dari total sampah rumah tangga di Indonesia.

## Cara Memulai Kompos

1. Siapkan ember plastik dengan tutup, lubangi sisi-sisinya.
2. Lapisi dasar dengan daun kering atau koran sobek.
3. Masukkan sampah organik (hindari daging, tulang, minyak).
4. Aduk seminggu sekali. Tambah daun kering jika terlalu basah.
5. Setelah 4-6 minggu, kompos siap dipakai untuk tanaman.

## Tips

Tidak perlu lahan luas — ember 20 liter cukup untuk keluarga 4 orang.`,
  },
];

// Mock waste bank user (for dashboard demo). Maps to /waste_bank_users.
// Login flow uses email + password.
export const mockBankUsers = [
  {
    id: 1,
    waste_bank_id: 1,
    email: "melati@banksampah.id",
    password: "demo1234", // demo only — never store plaintext in real backend
  },
  {
    id: 2,
    waste_bank_id: 2,
    email: "hijau@banksampah.id",
    password: "demo1234",
  },
];
