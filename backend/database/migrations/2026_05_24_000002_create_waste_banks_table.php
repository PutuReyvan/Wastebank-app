<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('waste_banks', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable();
            $table->string('source_name')->nullable();
            $table->string('source_url')->nullable();
            $table->timestamp('location_verified_at')->nullable();
            $table->string('name');
            $table->text('address');
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->index();
            $table->string('kota')->default('Jakarta Barat');
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('operating_hours')->nullable();
            $table->string('photo_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('waste_bank_catalog', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waste_bank_id')->constrained('waste_banks')->cascadeOnDelete();
            $table->foreignId('waste_type_id')->constrained('waste_types')->cascadeOnDelete();
            $table->decimal('price_per_kg', 10, 2)->default(0);
            $table->timestamps();
            $table->unique(['waste_bank_id', 'waste_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_bank_catalog');
        Schema::dropIfExists('waste_banks');
    }
};
