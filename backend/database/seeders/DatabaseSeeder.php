<?php

namespace Database\Seeders;

use App\Models\WasteBank;
use App\Models\WasteBankCatalog;
use App\Models\WasteType;
use Illuminate\Database\Seeder;

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
    }
}
