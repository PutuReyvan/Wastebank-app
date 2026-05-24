<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Admins (separate from waste_bank_users). Uses Sanctum for tokens.
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        // Waste types — master catalogue
        Schema::create('waste_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->index();
            $table->boolean('is_eligible')->default(true);
            $table->decimal('reference_price_per_kg', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('icon_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Waste banks — physical locations
        Schema::create('waste_banks', function (Blueprint $table) {
            $table->id();
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

        // Waste bank users — separate auth table
        Schema::create('waste_bank_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waste_bank_id')->constrained('waste_banks')->cascadeOnDelete();
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // Waste bank catalog — per-bank prices
        Schema::create('waste_bank_catalog', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waste_bank_id')->constrained('waste_banks')->cascadeOnDelete();
            $table->foreignId('waste_type_id')->constrained('waste_types')->cascadeOnDelete();
            $table->decimal('price_per_kg', 10, 2)->default(0);
            $table->timestamps();
            $table->unique(['waste_bank_id', 'waste_type_id']);
        });

        // Vendors — pickup / collectors directory
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['business', 'ngo'])->default('business');
            $table->string('service_area')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->text('description')->nullable();
            $table->string('photo_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Vendor ↔ waste types pivot
        Schema::create('vendor_waste_types', function (Blueprint $table) {
            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();
            $table->foreignId('waste_type_id')->constrained('waste_types')->cascadeOnDelete();
            $table->primary(['vendor_id', 'waste_type_id']);
        });

        // Recycling guides — articles
        Schema::create('recycling_guides', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->foreignId('waste_type_id')->nullable()->constrained('waste_types')->nullOnDelete();
            $table->string('cover_image_url')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recycling_guides');
        Schema::dropIfExists('vendor_waste_types');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('waste_bank_catalog');
        Schema::dropIfExists('waste_bank_users');
        Schema::dropIfExists('waste_banks');
        Schema::dropIfExists('waste_types');
        Schema::dropIfExists('admins');
    }
};
