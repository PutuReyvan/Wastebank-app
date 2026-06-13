<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('price_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('vendor')->index();
            $table->string('url')->nullable();
            $table->string('area')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('last_checked_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('external_waste_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_source_id')->constrained('price_sources')->cascadeOnDelete();
            $table->string('external_id')->nullable();
            $table->string('external_code')->nullable();
            $table->string('category')->index();
            $table->string('item_name')->index();
            $table->decimal('price', 12, 2)->default(0);
            $table->string('unit')->default('Kg');
            $table->string('image_url')->nullable();
            $table->timestamp('source_updated_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['price_source_id', 'external_id']);
            $table->index(['category', 'item_name']);
        });

        Schema::table('waste_banks', function (Blueprint $table) {
            $table->string('external_id')->nullable()->after('id');
            $table->string('source_name')->nullable()->after('external_id');
            $table->string('source_url')->nullable()->after('source_name');
            $table->timestamp('location_verified_at')->nullable()->after('source_url');
        });
    }

    public function down(): void
    {
        Schema::table('waste_banks', function (Blueprint $table) {
            $table->dropColumn([
                'external_id',
                'source_name',
                'source_url',
                'location_verified_at',
            ]);
        });

        Schema::dropIfExists('external_waste_prices');
        Schema::dropIfExists('price_sources');
    }
};
