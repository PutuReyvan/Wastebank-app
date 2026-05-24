<?php

namespace Database\Seeders;

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
    }
}
