<?php

namespace Database\Seeders;

use App\Models\WasteBank;
use App\Models\WasteBankCatalog;
use App\Models\ExternalWastePrice;
use App\Models\PriceSource;
use App\Models\WasteType;
use App\Models\RecyclingGuide;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $wasteTypes = [
            ['Botol PET Bening', 'Plastik', true, 4500, 'Botol minuman bening dari bahan PET. Dijual mahal jika bersih, kering, dan label dilepas.'],
            ['Botol Plastik Berwarna', 'Plastik', true, 2500, 'Botol plastik bekas minuman atau pembersih dengan warna.'],
            ['Plastik Kresek (HDPE/LDPE)', 'Plastik', true, 800, 'Kantong plastik belanjaan, bersih dan kering.'],
            ['Gelas Plastik', 'Plastik', true, 3000, 'Gelas plastik bekas minuman, label dilepas.'],
            ['Kardus', 'Kertas', true, 2200, 'Kardus bekas paket atau dus elektronik. Harus kering.'],
            ['Koran Bekas', 'Kertas', true, 2800, 'Koran bekas dalam kondisi kering dan tidak basah.'],
            ['Buku/HVS', 'Kertas', true, 2000, 'Buku, majalah, atau kertas HVS bekas.'],
            ['Duplex', 'Kertas', true, 1200, 'Karton dua lapis bekas kemasan makanan.'],
            ['Kaleng Aluminium', 'Logam', true, 14000, 'Kaleng minuman ringan, bir, dan kemasan aluminium lain.'],
            ['Besi Bekas', 'Logam', true, 4500, 'Potongan besi rumahan, paku, jeruji, atau barang logam bekas.'],
            ['Tembaga', 'Logam', true, 75000, 'Kabel tembaga atau pipa tembaga bekas.'],
            ['Botol Kaca Bening', 'Botol Kaca', true, 500, 'Botol kecap, sirup, atau saus dari kaca bening.'],
            ['Botol Kaca Warna', 'Botol Kaca', true, 300, 'Botol kaca berwarna hijau atau cokelat.'],
            ['Limbah Elektronik (E-waste)', 'Elektronik', true, 6000, 'Komputer, ponsel, charger, baterai, dan elektronik kecil bekas.'],
            ['Sampah Organik', 'Organik', false, 0, 'Sisa makanan, daun, dan kulit buah. Biasanya lebih cocok untuk kompos.'],
            ['Styrofoam', 'Plastik', false, 0, 'Tidak banyak diterima bank sampah, sebaiknya dikurangi pemakaiannya.'],
        ];

        foreach ($wasteTypes as [$name, $category, $eligible, $price, $description]) {
            WasteType::updateOrCreate(
                ['name' => $name],
                [
                    'category' => $category,
                    'is_eligible' => $eligible,
                    'reference_price_per_kg' => $price,
                    'reference_unit' => 'Kg',
                    'description' => $description,
                ],
            );
        }

        $banks = [
            [
                'name' => 'Bank Sampah Melati Bersih',
                'address' => 'Jl. Kembangan Raya No. 12, Kembangan Selatan, Kembangan',
                'kelurahan' => 'Kembangan Selatan',
                'kecamatan' => 'Kembangan',
                'lat' => -6.1944,
                'lng' => 106.7421,
                'phone' => '021-58901234',
                'whatsapp' => '081234567801',
                'operating_hours' => 'Senin-Sabtu, 08.00-16.00',
                'catalog' => [
                    ['Botol PET Bening', 4800],
                    ['Plastik Kresek (HDPE/LDPE)', 900],
                    ['Kardus', 2300],
                    ['Koran Bekas', 3000],
                    ['Kaleng Aluminium', 14500],
                ],
            ],
            [
                'name' => 'Bank Sampah Hijau Lestari',
                'address' => 'Jl. Daan Mogot Km. 14, Cengkareng Timur, Cengkareng',
                'kelurahan' => 'Cengkareng Timur',
                'kecamatan' => 'Cengkareng',
                'lat' => -6.1456,
                'lng' => 106.7261,
                'phone' => '021-54321009',
                'whatsapp' => '081234567802',
                'operating_hours' => 'Senin-Jumat, 09.00-15.00',
                'catalog' => [
                    ['Botol PET Bening', 4500],
                    ['Botol Plastik Berwarna', 2500],
                    ['Kardus', 2200],
                    ['Buku/HVS', 2000],
                    ['Besi Bekas', 4600],
                    ['Limbah Elektronik (E-waste)', 6500],
                ],
            ],
            [
                'name' => 'Bank Sampah Kebon Jeruk Sejahtera',
                'address' => 'Jl. Pos Pengumben No. 45, Sukabumi Utara, Kebon Jeruk',
                'kelurahan' => 'Sukabumi Utara',
                'kecamatan' => 'Kebon Jeruk',
                'lat' => -6.1908,
                'lng' => 106.7726,
                'phone' => '021-53651122',
                'whatsapp' => '081234567803',
                'operating_hours' => 'Senin-Sabtu, 07.30-16.00',
                'catalog' => [
                    ['Botol PET Bening', 4700],
                    ['Plastik Kresek (HDPE/LDPE)', 850],
                    ['Gelas Plastik', 3100],
                    ['Kardus', 2300],
                    ['Kaleng Aluminium', 14000],
                    ['Tembaga', 76000],
                ],
            ],
        ];

        foreach ($banks as $data) {
            $catalog = $data['catalog'];
            unset($data['catalog']);

            $bank = WasteBank::updateOrCreate(
                ['name' => $data['name']],
                array_merge($data, [
                    'kota' => 'Jakarta Barat',
                    'source_name' => 'Seed data',
                    'is_active' => true,
                ]),
            );

            WasteBankCatalog::where('waste_bank_id', $bank->id)->delete();
            foreach ($catalog as [$wasteTypeName, $price]) {
                $wasteType = WasteType::where('name', $wasteTypeName)->first();
                if (!$wasteType) {
                    continue;
                }

                WasteBankCatalog::create([
                    'waste_bank_id' => $bank->id,
                    'waste_type_id' => $wasteType->id,
                    'price_per_kg' => $price,
                ]);
            }
        }

        // ---- Guides ----
        $guides = [
            [1, 'Cara Memilah Sampah Plastik agar Bernilai Lebih', 'Botol plastik yang bersih dan label terlepas bisa dijual hingga 2x lipat. Begini caranya.', 1, '2026-01-04', 'https://images.unsplash.com/photo-1572964734607-0051976fac79?auto=format&fit=crop&w=1200&q=70', "Sampah plastik adalah salah satu jenis sampah yang paling banyak diterima bank sampah di Indonesia. Namun, harganya bisa sangat berbeda tergantung kondisi dan jenis plastiknya.\n\n## Langkah Memilah Plastik\n\n1. **Pisahkan berdasarkan jenis** — PET (botol bening), HDPE (kemasan deterjen), LDPE (kresek), PP (gelas plastik).\n2. **Cuci dan keringkan** — Plastik basah/berbau akan ditolak atau dihargai jauh lebih rendah.\n3. **Lepas label dan tutup** — Label kertas akan menurunkan kualitas plastik saat didaur ulang.\n4. **Tekan untuk hemat tempat** — Mudahkan pengangkutan, dan beberapa bank sampah memberi bonus untuk plastik yang sudah dipres.\n\n## Yang Tidak Diterima\n\n- Styrofoam (sebagian besar bank sampah tidak menerimanya)\n- Plastik kemasan multilayer (snack, bumbu instan)\n- Plastik yang bercampur makanan basah\n\n## Tips Tambahan\n\nSimpan plastik di tempat kering dan jauhkan dari sinar matahari langsung agar tidak rapuh. Setor minimal 1 minggu sekali agar volume cukup ekonomis."],
            [2, 'Panduan Memilah Kardus dan Kertas', 'Kardus kering bernilai lebih tinggi dari koran. Pelajari cara penanganan terbaiknya.', 5, '2026-01-02', 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=70', "Kardus dan kertas adalah komoditas yang stabil di pasar daur ulang.\n\n## Cara Memilah\n\n1. Pisahkan kardus, koran, dan HVS — masing-masing punya harga berbeda.\n2. Pastikan benar-benar kering. Kertas basah tidak akan diterima.\n3. Lipat kardus agar mudah ditumpuk dan diangkut.\n4. Buang isi staples atau lakban besar untuk meningkatkan kualitas.\n\n## Yang Tidak Diterima\n\n- Kertas berlapis lilin (kemasan susu/jus)\n- Tisu bekas pakai\n- Kertas thermal struk belanja\n\n## Penyimpanan\n\nSimpan di area kering, tidak terkena hujan. Setor sebelum musim hujan jika menyimpan dalam jumlah besar."],
            [3, 'Logam Bekas: Aluminium, Besi, dan Tembaga', 'Tembaga adalah logam dengan harga tertinggi di pasar rongsokan. Begini cara mengenalinya.', 9, '2025-12-28', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=70', "Logam bekas adalah jenis sampah dengan nilai ekonomi tertinggi.\n\n## Tiga Jenis Utama\n\n1. **Aluminium** — Kaleng minuman, panci tipis. Ringan, tidak menempel magnet.\n2. **Besi** — Magnetis, paling umum, harga paling rendah dari ketiga jenis.\n3. **Tembaga** — Kabel, pipa AC, koil dinamo. Harga paling mahal — bisa Rp 70.000+/kg.\n\n## Tips\n\n- Kupas insulasi kabel untuk mendapatkan tembaga murni (harga lebih tinggi).\n- Pastikan tidak basah/berkarat berat untuk besi.\n- Pisahkan dari logam lain saat ditimbang."],
            [4, 'Botol Kaca: Apa yang Perlu Anda Tahu', 'Tidak semua bank sampah menerima kaca. Pelajari di mana menyetornya.', 12, '2025-12-22', 'https://images.unsplash.com/photo-1610631066894-62452ccb927c?auto=format&fit=crop&w=1200&q=70', "Botol kaca punya harga yang relatif rendah, tapi tetap bernilai jika dikumpulkan rapi.\n\n## Cara Memilah\n\n- Pisahkan bening, hijau, dan cokelat.\n- Lepas tutup logam (jual terpisah sebagai logam).\n- Bungkus dengan koran agar tidak pecah saat diangkut.\n\n## Catatan\n\nBanyak bank sampah Jakarta Barat yang sudah tidak menerima kaca karena rendahnya margin. Cek dulu di direktori sebelum membawa."],
            [5, 'E-Waste: Ke Mana Sampah Elektronik Anda?', 'Limbah elektronik berbahaya jika dibuang sembarangan. Inilah pilihan amannya.', 14, '2025-12-15', 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=70', "Sampah elektronik (e-waste) mengandung logam berat seperti merkuri dan timbal yang berbahaya jika masuk lingkungan.\n\n## Yang Termasuk E-Waste\n\n- Ponsel & charger lama\n- Laptop, hard drive, baterai laptop\n- Lampu LED & neon (lampu neon mengandung merkuri)\n- Adaptor, kabel, casing PC\n\n## Cara Setor\n\n1. Cari NGO atau pengepul khusus e-waste (lihat halaman Vendor → filter Elektronik).\n2. Hapus data pribadi dari ponsel/laptop sebelum diserahkan.\n3. Banyak NGO menerima gratis untuk volume kecil."],
            [6, 'Memulai Kompos di Rumah dari Sampah Organik', 'Sampah organik tidak diterima bank sampah, tapi bisa Anda olah jadi pupuk gratis di rumah.', 15, '2025-12-10', 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=70', "Sampah organik (sisa makanan, kulit buah, daun) adalah 40-60% dari total sampah rumah tangga di Indonesia.\n\n## Cara Memulai Kompos\n\n1. Siapkan ember plastik dengan tutup, lubangi sisi-sisinya.\n2. Lapisi dasar dengan daun kering atau koran sobek.\n3. Masukkan sampah organik (hindari daging, tulang, minyak).\n4. Aduk seminggu sekali. Tambah daun kering jika terlalu basah.\n5. Setelah 4-6 minggu, kompos siap dipakai untuk tanaman.\n\n## Tips\n\nTidak perlu lahan luas — ember 20 liter cukup untuk keluarga 4 orang."],
        ];
        foreach ($guides as [$id, $title, $excerpt, $wid, $date, $cover, $content]) {
            RecyclingGuide::updateOrCreate(['id' => $id], [
                'title' => $title, 'excerpt' => $excerpt, 'content' => $content,
                'waste_type_id' => $wid, 'cover_image_url' => $cover,
                'published_at' => Carbon::parse($date . ' 09:00:00'),
            ]);
        }

        $source = PriceSource::updateOrCreate(
            ['name' => 'Baseline Price List'],
            [
                'type' => 'reference',
                'url' => null,
                'area' => 'Jakarta Barat',
                'notes' => 'Seed reference prices for the baseline price list feature.',
                'last_checked_at' => now(),
                'is_active' => true,
            ],
        );

        $priceRows = [
            ['PL-001', 'Plastik', 'Botol PET Bening', 4500],
            ['PL-002', 'Plastik', 'Botol Plastik Berwarna', 2500],
            ['PL-003', 'Plastik', 'Gelas Plastik', 3000],
            ['PL-004', 'Kertas', 'Kardus', 2200],
            ['PL-005', 'Kertas', 'Koran Bekas', 2800],
            ['PL-006', 'Logam', 'Kaleng Aluminium', 14000],
            ['PL-007', 'Logam', 'Besi Bekas', 4500],
            ['PL-008', 'Logam', 'Tembaga', 75000],
            ['PL-009', 'Botol Kaca', 'Botol Kaca Bening', 500],
            ['PL-010', 'Elektronik', 'Limbah Elektronik (E-waste)', 6000],
        ];

        foreach ($priceRows as [$code, $category, $itemName, $price]) {
            ExternalWastePrice::updateOrCreate(
                [
                    'price_source_id' => $source->id,
                    'external_id' => $code,
                ],
                [
                    'external_code' => $code,
                    'category' => $category,
                    'item_name' => $itemName,
                    'price' => $price,
                    'unit' => 'Kg',
                    'source_updated_at' => now(),
                    'is_active' => true,
                ],
            );
        }
    }
}
