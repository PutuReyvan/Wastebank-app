FROM php:8.4-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libicu-dev \
        libpq-dev \
        libzip-dev \
    && docker-php-ext-install \
        intl \
        pdo_pgsql \
        zip \
        opcache \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && chmod -R ug+rw storage bootstrap/cache

CMD php artisan migrate --force --seed \
    && php artisan config:cache \
    && php artisan serve --host=0.0.0.0 --port=${PORT}
