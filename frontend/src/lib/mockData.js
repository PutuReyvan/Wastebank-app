export const wasteTypes = [
  {
    id: 1,
    name: "Botol PET Bening",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 4500,
    reference_unit: "Kg",
    description: "Botol minuman bening dari bahan PET. Dijual mahal jika bersih, kering, dan label dilepas.",
  },
  {
    id: 2,
    name: "Botol Plastik Berwarna",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 2500,
    reference_unit: "Kg",
    description: "Botol plastik bekas minuman atau pembersih dengan warna.",
  },
  {
    id: 3,
    name: "Plastik Kresek (HDPE/LDPE)",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 800,
    reference_unit: "Kg",
    description: "Kantong plastik belanjaan, bersih dan kering.",
  },
  {
    id: 4,
    name: "Gelas Plastik",
    category: "Plastik",
    is_eligible: true,
    reference_price_per_kg: 3000,
    reference_unit: "Kg",
    description: "Gelas plastik bekas minuman, label dilepas.",
  },
  {
    id: 5,
    name: "Kardus",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 2200,
    reference_unit: "Kg",
    description: "Kardus bekas paket atau dus elektronik. Harus kering.",
  },
  {
    id: 6,
    name: "Koran Bekas",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 2800,
    reference_unit: "Kg",
    description: "Koran bekas dalam kondisi kering dan tidak basah.",
  },
  {
    id: 7,
    name: "Buku/HVS",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 2000,
    reference_unit: "Kg",
    description: "Buku, majalah, atau kertas HVS bekas.",
  },
  {
    id: 8,
    name: "Duplex",
    category: "Kertas",
    is_eligible: true,
    reference_price_per_kg: 1200,
    reference_unit: "Kg",
    description: "Karton dua lapis bekas kemasan makanan.",
  },
  {
    id: 9,
    name: "Kaleng Aluminium",
    category: "Logam",
    is_eligible: true,
    reference_price_per_kg: 14000,
    reference_unit: "Kg",
    description: "Kaleng minuman ringan, bir, dan kemasan aluminium lain.",
  },
  {
    id: 10,
    name: "Besi Bekas",
    category: "Logam",
    is_eligible: true,
    reference_price_per_kg: 4500,
    reference_unit: "Kg",
    description: "Potongan besi rumahan, paku, jeruji, atau barang logam bekas.",
  },
  {
    id: 11,
    name: "Tembaga",
    category: "Logam",
    is_eligible: true,
    reference_price_per_kg: 75000,
    reference_unit: "Kg",
    description: "Kabel tembaga atau pipa tembaga bekas.",
  },
  {
    id: 12,
    name: "Botol Kaca Bening",
    category: "Botol Kaca",
    is_eligible: true,
    reference_price_per_kg: 500,
    reference_unit: "Kg",
    description: "Botol kecap, sirup, atau saus dari kaca bening.",
  },
  {
    id: 13,
    name: "Botol Kaca Warna",
    category: "Botol Kaca",
    is_eligible: true,
    reference_price_per_kg: 300,
    reference_unit: "Kg",
    description: "Botol kaca berwarna hijau atau cokelat.",
  },
  {
    id: 14,
    name: "Limbah Elektronik (E-waste)",
    category: "Elektronik",
    is_eligible: true,
    reference_price_per_kg: 6000,
    reference_unit: "Kg",
    description: "Komputer, ponsel, charger, baterai, dan elektronik kecil bekas.",
  },
  {
    id: 15,
    name: "Sampah Organik",
    category: "Organik",
    is_eligible: false,
    reference_price_per_kg: 0,
    reference_unit: "Kg",
    description: "Sisa makanan, daun, dan kulit buah. Biasanya lebih cocok untuk kompos.",
  },
  {
    id: 16,
    name: "Styrofoam",
    category: "Plastik",
    is_eligible: false,
    reference_price_per_kg: 0,
    reference_unit: "Kg",
    description: "Tidak banyak diterima bank sampah, sebaiknya dikurangi pemakaiannya.",
  },
];

export const wasteCategories = [
  "Semua",
  "Botol Kaca",
  "Elektronik",
  "Kertas",
  "Logam",
  "Organik",
  "Plastik",
];

const catalog = (waste_type_id, price_per_kg, updated_at = "2026-05-24T09:00:00+07:00") => ({
  waste_type_id,
  price_per_kg,
  updated_at,
});

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
    operating_hours: "Senin-Sabtu, 08.00-16.00",
    photo_url: "",
    is_active: true,
    catalog: [
      catalog(1, 4800),
      catalog(3, 900),
      catalog(5, 2300),
      catalog(6, 3000),
      catalog(9, 14500),
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
    operating_hours: "Senin-Jumat, 09.00-15.00",
    photo_url: "",
    is_active: true,
    catalog: [
      catalog(1, 4500),
      catalog(2, 2500),
      catalog(5, 2200),
      catalog(7, 2000),
      catalog(10, 4600),
      catalog(14, 6500),
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
    operating_hours: "Senin-Sabtu, 07.30-16.00",
    photo_url: "",
    is_active: true,
    catalog: [
      catalog(1, 4700),
      catalog(3, 850),
      catalog(4, 3100),
      catalog(5, 2300),
      catalog(9, 14000),
      catalog(11, 76000),
    ],
  },
];

export const priceSources = [
  {
    id: 1,
    name: "Baseline Price List",
    type: "reference",
    url: null,
    area: "Jakarta Barat",
    notes: "Seed reference prices for the baseline price list feature.",
    last_checked_at: "2026-05-24T09:00:00+07:00",
    prices_count: 10,
    is_active: true,
  },
];

export const externalPrices = [
  ["PL-001", "Plastik", "Botol PET Bening", 4500],
  ["PL-002", "Plastik", "Botol Plastik Berwarna", 2500],
  ["PL-003", "Plastik", "Gelas Plastik", 3000],
  ["PL-004", "Kertas", "Kardus", 2200],
  ["PL-005", "Kertas", "Koran Bekas", 2800],
  ["PL-006", "Logam", "Kaleng Aluminium", 14000],
  ["PL-007", "Logam", "Besi Bekas", 4500],
  ["PL-008", "Logam", "Tembaga", 75000],
  ["PL-009", "Botol Kaca", "Botol Kaca Bening", 500],
  ["PL-010", "Elektronik", "Limbah Elektronik (E-waste)", 6000],
].map(([external_code, category, item_name, price], index) => ({
  id: index + 1,
  source: priceSources[0],
  external_id: external_code,
  external_code,
  category,
  item_name,
  price,
  unit: "Kg",
  image_url: null,
  source_updated_at: "2026-05-24T09:00:00+07:00",
}));

export const guides = [
  {
    id: 1,
    title: "Cara Memilah Sampah Plastik agar Bernilai Lebih",
    excerpt: "Botol plastik yang bersih dan label terlepas bisa dijual hingga 2x lipat. Begini caranya.",
    waste_type_id: 1,
    cover_image_url: "https://images.unsplash.com/photo-1572964734607-0051976fac79?auto=format&fit=crop&w=1200&q=70",
    published_at: "2026-01-04T09:00:00+07:00",
    content: `Sampah plastik adalah salah satu jenis sampah yang paling banyak diterima bank sampah di Indonesia.

## Langkah Memilah Plastik

1. Pisahkan berdasarkan jenis plastik.
2. Cuci dan keringkan sebelum disetor.
3. Lepas label dan tutup jika diminta.
4. Tekan botol untuk menghemat tempat.

## Tips Tambahan

Simpan plastik di tempat kering dan setor secara rutin.`,
  },
  {
    id: 2,
    title: "Panduan Memilah Kardus dan Kertas",
    excerpt: "Kardus kering bernilai lebih tinggi dari koran. Pelajari cara penanganan terbaiknya.",
    waste_type_id: 5,
    cover_image_url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=70",
    published_at: "2026-01-02T09:00:00+07:00",
    content: `Kardus dan kertas adalah komoditas yang stabil di pasar daur ulang.

## Cara Memilah

1. Pisahkan kardus, koran, dan HVS.
2. Pastikan semuanya kering.
3. Lipat kardus agar mudah ditumpuk.

## Yang Tidak Diterima

- Kertas berlapis lilin
- Tisu bekas pakai
- Kertas thermal struk belanja`,
  },
  {
    id: 3,
    title: "Logam Bekas: Aluminium, Besi, dan Tembaga",
    excerpt: "Tembaga adalah logam dengan harga tertinggi di pasar rongsokan. Begini cara mengenalinya.",
    waste_type_id: 9,
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=70",
    published_at: "2025-12-28T09:00:00+07:00",
    content: `Logam bekas adalah jenis sampah dengan nilai ekonomi tinggi.

## Tiga Jenis Utama

1. Aluminium ringan dan tidak menempel magnet.
2. Besi biasanya magnetis.
3. Tembaga sering berasal dari kabel atau pipa.

## Tips

- Pisahkan logam berdasarkan jenis.
- Pastikan material tidak bercampur sampah basah.`,
  },
];
