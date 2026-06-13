<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\WasteType;
use App\Models\WasteBank;
use App\Models\WasteBankUser;
use App\Models\WasteBankCatalog;
use App\Models\Vendor;
use App\Models\RecyclingGuide;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Admin ----
        Admin::updateOrCreate(
            ['email' => 'admin@banksampah.id'],
            ['name' => 'Admin Platform', 'password' => Hash::make('admin1234')]
        );

        // ---- Waste types ----
        $wasteTypes = [
            [1, 'Botol PET Bening', 'Plastik', true, 4500, 'Botol minuman bening dari bahan PET. Dijual mahal jika bersih, kering, dan label dilepas.'],
            [2, 'Botol Plastik Berwarna', 'Plastik', true, 2500, 'Botol plastik bekas minuman atau pembersih dengan warna.'],
            [3, 'Plastik Kresek (HDPE/LDPE)', 'Plastik', true, 800, 'Kantong plastik belanjaan, bersih dan kering.'],
            [4, 'Gelas Plastik', 'Plastik', true, 3000, 'Gelas plastik bekas minuman, label dilepas.'],
            [5, 'Kardus', 'Kertas', true, 2200, 'Kardus bekas paket atau dus elektronik. Harus kering.'],
            [6, 'Koran Bekas', 'Kertas', true, 2800, 'Koran bekas dalam kondisi kering dan tidak basah.'],
            [7, 'Buku/HVS', 'Kertas', true, 2000, 'Buku, majalah, atau kertas HVS bekas.'],
            [8, 'Duplex', 'Kertas', true, 1200, 'Karton dua lapis bekas kemasan makanan.'],
            [9, 'Kaleng Aluminium', 'Logam', true, 14000, 'Kaleng minuman ringan, bir, dll.'],
            [10, 'Besi Bekas', 'Logam', true, 4500, 'Potongan besi rumahan, paku, jeruji.'],
            [11, 'Tembaga', 'Logam', true, 75000, 'Kabel tembaga atau pipa tembaga bekas.'],
            [12, 'Botol Kaca Bening', 'Kaca', true, 500, 'Botol kecap, sirup, atau saus dari kaca bening.'],
            [13, 'Botol Kaca Warna', 'Kaca', true, 300, 'Botol kaca berwarna hijau atau cokelat.'],
            [14, 'Limbah Elektronik (E-waste)', 'Elektronik', true, 6000, 'Komputer, ponsel, charger, baterai bekas. Wajib dikumpulkan terpisah.'],
            [15, 'Sampah Organik', 'Organik', false, 0, 'Sisa makanan, daun, kulit buah. Tidak diterima bank sampah, tapi bisa untuk kompos rumah.'],
            [16, 'Styrofoam', 'Plastik', false, 0, 'Tidak banyak diterima, sebaiknya kurangi pemakaian.'],
        ];
        foreach ($wasteTypes as [$id, $name, $cat, $eligible, $price, $desc]) {
            WasteType::updateOrCreate(['id' => $id], [
                'name' => $name, 'category' => $cat, 'is_eligible' => $eligible,
                'reference_price_per_kg' => $price, 'description' => $desc,
            ]);
        }

        // ---- Waste banks + users + catalog ----
        $banks = [
            [1, 'Bank Sampah Melati Bersih', 'Jl. Kembangan Raya No. 12, Kembangan Selatan, Kembangan', 'Kembangan Selatan', 'Kembangan', -6.1944, 106.7421, '021-58901234', '081234567801', 'Sen–Sab, 08.00–16.00', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=70', 'melati@banksampah.id', [[1, 4800], [3, 900], [5, 2300], [6, 3000], [9, 14500], [12, 500]]],
            [2, 'Bank Sampah Hijau Lestari', 'Jl. Daan Mogot Km. 14, Cengkareng Timur, Cengkareng', 'Cengkareng Timur', 'Cengkareng', -6.1456, 106.7261, '021-54321009', '081234567802', 'Sen–Jum, 09.00–15.00', 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=70', 'hijau@banksampah.id', [[1, 4500], [2, 2500], [5, 2200], [7, 2000], [10, 4600], [14, 6500]]],
            [3, 'Bank Sampah Kebon Jeruk Sejahtera', 'Jl. Pos Pengumben No. 45, Sukabumi Utara, Kebon Jeruk', 'Sukabumi Utara', 'Kebon Jeruk', -6.1908, 106.7726, '021-53651122', '081234567803', 'Sen–Sab, 07.30–16.00', 'https://images.unsplash.com/photo-1572125675722-238a4f1f8ea7?auto=format&fit=crop&w=800&q=70', 'kebonjeruk@banksampah.id', [[1, 4700], [3, 850], [4, 3100], [5, 2300], [6, 2900], [9, 14000], [11, 76000]]],
            [4, 'Bank Sampah Palmerah Mandiri', 'Jl. Palmerah Barat No. 88, Palmerah, Palmerah', 'Palmerah', 'Palmerah', -6.2055, 106.7912, '021-53699988', '081234567804', 'Sen–Jum, 08.00–17.00', 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=70', 'palmerah@banksampah.id', [[1, 4400], [2, 2400], [5, 2100], [7, 1900], [8, 1200], [13, 300]]],
            [5, 'Bank Sampah Kalideres Asri', 'Jl. Peta Selatan No. 22, Kalideres, Kalideres', 'Kalideres', 'Kalideres', -6.1394, 106.7058, '021-54399876', '081234567805', 'Sen–Sab, 08.00–15.00', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=70', 'kalideres@banksampah.id', [[1, 4600], [3, 800], [5, 2200], [6, 2800], [10, 4500]]],
            [6, 'Bank Sampah Tambora Berkah', 'Jl. Jembatan Lima No. 17, Jembatan Lima, Tambora', 'Jembatan Lima', 'Tambora', -6.1457, 106.8123, '021-63332100', '081234567806', 'Sen–Jum, 09.00–16.00', 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=70', 'tambora@banksampah.id', [[1, 4500], [2, 2500], [5, 2200], [9, 14200], [12, 500], [13, 300]]],
            [7, 'Bank Sampah Taman Sari Hijau', 'Jl. Mangga Besar Raya No. 30, Maphar, Taman Sari', 'Maphar', 'Taman Sari', -6.1492, 106.8245, '021-62345678', '081234567807', 'Sen–Sab, 08.00–16.00', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=70', 'tamansari@banksampah.id', [[1, 4700], [3, 900], [5, 2400], [6, 3000], [9, 14000], [14, 6200]]],
            [8, 'Bank Sampah Grogol Lestari', 'Jl. S. Parman No. 9, Tanjung Duren Selatan, Grogol Petamburan', 'Tanjung Duren Selatan', 'Grogol Petamburan', -6.1689, 106.7912, '021-56945612', '081234567808', 'Sen–Jum, 08.30–17.00', 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=70', 'grogol@banksampah.id', [[1, 4600], [2, 2500], [4, 3000], [5, 2300], [7, 2100], [11, 75000]]],
        ];
        foreach ($banks as [$id, $name, $addr, $kel, $kec, $lat, $lng, $phone, $wa, $hours, $photo, $email, $catalog]) {
            $bank = WasteBank::updateOrCreate(['id' => $id], [
                'name' => $name, 'address' => $addr, 'kelurahan' => $kel,
                'kecamatan' => $kec, 'kota' => 'Jakarta Barat',
                'lat' => $lat, 'lng' => $lng,
                'phone' => $phone, 'whatsapp' => $wa,
                'operating_hours' => $hours, 'photo_url' => $photo,
                'is_active' => true,
            ]);
            WasteBankUser::updateOrCreate(['email' => $email], [
                'waste_bank_id' => $bank->id,
                'password' => Hash::make('demo1234'),
            ]);
            WasteBankCatalog::where('waste_bank_id', $bank->id)->delete();
            foreach ($catalog as [$wid, $price]) {
                WasteBankCatalog::create([
                    'waste_bank_id' => $bank->id,
                    'waste_type_id' => $wid,
                    'price_per_kg' => $price,
                ]);
            }
        }

        // ---- Vendors ----
        $vendors = [
            [1, 'PT Daur Ulang Nusantara', 'business', 'Jakarta Barat, Tangerang', null, null, 'Pengepul plastik dan kardus skala menengah. Pickup minimal 50 kg, area Jakarta Barat & sekitarnya.', [1, 2, 3, 4, 5, 6]],
            [2, 'Yayasan Bumi Bersih', 'ngo', 'Jakarta Barat', null, null, 'NGO lingkungan yang mengoordinasikan pengambilan sampah elektronik (e-waste) gratis untuk warga.', [14, 11]],
            [3, 'Pak Joko Rongsok Jaya', 'business', 'Kembangan, Kebon Jeruk, Palmerah', null, null, 'Pengepul rumahan keliling. Bisa pickup harian untuk besi, kardus, koran. Minimal 10 kg.', [5, 6, 7, 9, 10]],
            [4, 'CV Logam Mulya', 'business', 'Jakarta Barat, Jakarta Utara', null, null, 'Spesialis logam: besi, tembaga, aluminium. Harga negosiasi untuk volume besar.', [9, 10, 11]],
            [5, 'Komunitas Bumi Hijau', 'ngo', 'Jakarta Barat', null, null, 'Komunitas warga yang membantu warga belajar memilah sampah. Kunjungan edukasi & pickup gratis.', [1, 5, 6, 9]],
        ];
        foreach ($vendors as [$id, $name, $type, $area, $phone, $wa, $desc, $typeIds]) {
            $v = Vendor::updateOrCreate(['id' => $id], [
                'name' => $name, 'type' => $type, 'service_area' => $area,
                'phone' => $phone, 'whatsapp' => $wa, 'description' => $desc, 'is_active' => true,
            ]);
            $v->wasteTypes()->sync($typeIds);
        }

        // ---- Guides ----
        $guides = [
            [1, 'Cara Memilah Sampah Plastik agar Bernilai Lebih', 'Botol plastik yang bersih dan label terlepas bisa dijual hingga 2x lipat. Begini caranya.', 1, '2026-01-04', '/images/guides/plastic.svg', "Sampah plastik adalah salah satu jenis sampah yang paling banyak diterima bank sampah di Indonesia. Namun, harganya bisa sangat berbeda tergantung kondisi dan jenis plastiknya.\n\n## Langkah Memilah Plastik\n\n1. **Pisahkan berdasarkan jenis** — PET (botol bening), HDPE (kemasan deterjen), LDPE (kresek), PP (gelas plastik).\n2. **Cuci dan keringkan** — Plastik basah/berbau akan ditolak atau dihargai jauh lebih rendah.\n3. **Lepas label dan tutup** — Label kertas akan menurunkan kualitas plastik saat didaur ulang.\n4. **Tekan untuk hemat tempat** — Mudahkan pengangkutan, dan beberapa bank sampah memberi bonus untuk plastik yang sudah dipres.\n\n## Yang Tidak Diterima\n\n- Styrofoam (sebagian besar bank sampah tidak menerimanya)\n- Plastik kemasan multilayer (snack, bumbu instan)\n- Plastik yang bercampur makanan basah\n\n## Tips Tambahan\n\nSimpan plastik di tempat kering dan jauhkan dari sinar matahari langsung agar tidak rapuh. Setor minimal 1 minggu sekali agar volume cukup ekonomis."],
            [2, 'Panduan Memilah Kardus dan Kertas', 'Kardus kering bernilai lebih tinggi dari koran. Pelajari cara penanganan terbaiknya.', 5, '2026-01-02', '/images/guides/paper.svg', "Kardus dan kertas adalah komoditas yang stabil di pasar daur ulang.\n\n## Cara Memilah\n\n1. Pisahkan kardus, koran, dan HVS — masing-masing punya harga berbeda.\n2. Pastikan benar-benar kering. Kertas basah tidak akan diterima.\n3. Lipat kardus agar mudah ditumpuk dan diangkut.\n4. Buang isi staples atau lakban besar untuk meningkatkan kualitas.\n\n## Yang Tidak Diterima\n\n- Kertas berlapis lilin (kemasan susu/jus)\n- Tisu bekas pakai\n- Kertas thermal struk belanja\n\n## Penyimpanan\n\nSimpan di area kering, tidak terkena hujan. Setor sebelum musim hujan jika menyimpan dalam jumlah besar."],
            [3, 'Logam Bekas: Aluminium, Besi, dan Tembaga', 'Tembaga adalah logam dengan harga tertinggi di pasar rongsokan. Begini cara mengenalinya.', 9, '2025-12-28', '/images/guides/metal.svg', "Logam bekas adalah jenis sampah dengan nilai ekonomi tertinggi.\n\n## Tiga Jenis Utama\n\n1. **Aluminium** — Kaleng minuman, panci tipis. Ringan, tidak menempel magnet.\n2. **Besi** — Magnetis, paling umum, harga paling rendah dari ketiga jenis.\n3. **Tembaga** — Kabel, pipa AC, koil dinamo. Harga paling mahal — bisa Rp 70.000+/kg.\n\n## Tips\n\n- Kupas insulasi kabel untuk mendapatkan tembaga murni (harga lebih tinggi).\n- Pastikan tidak basah/berkarat berat untuk besi.\n- Pisahkan dari logam lain saat ditimbang."],
            [4, 'Botol Kaca: Apa yang Perlu Anda Tahu', 'Tidak semua bank sampah menerima kaca. Pelajari di mana menyetornya.', 12, '2025-12-22', '/images/guides/glass.svg', "Botol kaca punya harga yang relatif rendah, tapi tetap bernilai jika dikumpulkan rapi.\n\n## Cara Memilah\n\n- Pisahkan bening, hijau, dan cokelat.\n- Lepas tutup logam (jual terpisah sebagai logam).\n- Bungkus dengan koran agar tidak pecah saat diangkut.\n\n## Catatan\n\nBanyak bank sampah Jakarta Barat yang sudah tidak menerima kaca karena rendahnya margin. Cek dulu di direktori sebelum membawa."],
            [5, 'E-Waste: Ke Mana Sampah Elektronik Anda?', 'Limbah elektronik berbahaya jika dibuang sembarangan. Inilah pilihan amannya.', 14, '2025-12-15', '/images/guides/ewaste.svg', "Sampah elektronik (e-waste) mengandung logam berat seperti merkuri dan timbal yang berbahaya jika masuk lingkungan.\n\n## Yang Termasuk E-Waste\n\n- Ponsel & charger lama\n- Laptop, hard drive, baterai laptop\n- Lampu LED & neon (lampu neon mengandung merkuri)\n- Adaptor, kabel, casing PC\n\n## Cara Setor\n\n1. Cari NGO atau pengepul khusus e-waste (lihat halaman Vendor → filter Elektronik).\n2. Hapus data pribadi dari ponsel/laptop sebelum diserahkan.\n3. Banyak NGO menerima gratis untuk volume kecil."],
            [6, 'Memulai Kompos di Rumah dari Sampah Organik', 'Sampah organik tidak diterima bank sampah, tapi bisa Anda olah jadi pupuk gratis di rumah.', 15, '2025-12-10', '/images/guides/compost.svg', "Sampah organik (sisa makanan, kulit buah, daun) adalah 40-60% dari total sampah rumah tangga di Indonesia.\n\n## Cara Memulai Kompos\n\n1. Siapkan ember plastik dengan tutup, lubangi sisi-sisinya.\n2. Lapisi dasar dengan daun kering atau koran sobek.\n3. Masukkan sampah organik (hindari daging, tulang, minyak).\n4. Aduk seminggu sekali. Tambah daun kering jika terlalu basah.\n5. Setelah 4-6 minggu, kompos siap dipakai untuk tanaman.\n\n## Tips\n\nTidak perlu lahan luas — ember 20 liter cukup untuk keluarga 4 orang."],
        ];
        foreach ($guides as [$id, $title, $excerpt, $wid, $date, $cover, $content]) {
            RecyclingGuide::updateOrCreate(['id' => $id], [
                'title' => $title, 'excerpt' => $excerpt, 'content' => $content,
                'waste_type_id' => $wid, 'cover_image_url' => $cover,
                'published_at' => Carbon::parse($date . ' 09:00:00'),
            ]);
        }
    }
}
