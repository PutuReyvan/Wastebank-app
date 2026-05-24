<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('waste_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->index();
            $table->boolean('is_eligible')->default(true);
            $table->decimal('reference_price_per_kg', 10, 2)->default(0);
            $table->string('reference_unit')->default('Kg');
            $table->text('description')->nullable();
            $table->string('icon_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_types');
    }
};
