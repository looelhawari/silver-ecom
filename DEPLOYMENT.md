# Deployment

Target: **Ubuntu VPS + Nginx + PHP-FPM + MySQL + HTTPS**, with a queue worker and
scheduler. Frontend is a Next.js app (Node server or static/edge host).

## Backend (Laravel)

### Server packages
- PHP 8.3 (+ extensions: mbstring, xml, curl, mysql, gd/imagick, bcmath, intl, zip)
- Composer 2, MySQL 8, Nginx, Supervisor (for the queue worker)

### Steps
```bash
git clone <repo> /var/www/fidda-silver
cd /var/www/fidda-silver/backend
cp .env.example .env          # set production values (see below)
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force --seed
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

### Production `.env` essentials
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain
APP_TIMEZONE=Africa/Cairo
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=fidda_silver
DB_USERNAME=fidda
DB_PASSWORD=<strong-secret>
FRONTEND_URL=https://your-frontend-domain
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain
SESSION_DOMAIN=.your-domain          # for cross-subdomain SPA cookies
ADMIN_EMAIL=<real-admin-email>
ADMIN_PASSWORD=<strong-secret>
```

### Nginx (backend)
- Document root: `backend/public`
- `try_files $uri /index.php?$query_string;` → PHP-FPM
- Force HTTPS (Let's Encrypt / Certbot).

### Queue worker (Supervisor)
```
[program:fidda-queue]
command=php /var/www/fidda-silver/backend/artisan queue:work --tries=3 --timeout=90
autostart=true
autorestart=true
```

### Scheduler (cron)
```
* * * * * cd /var/www/fidda-silver/backend && php artisan schedule:run >> /dev/null 2>&1
```

### Storage & permissions
```bash
php artisan storage:link
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```
Uploaded files (product images, payment proofs, custom-order images) are validated
and stored via the Media module; keep private uploads outside the web root.

## Frontend (Next.js)

```bash
cd frontend
npm ci
# set NEXT_PUBLIC_API_URL=https://your-domain/api/v1 and NEXT_PUBLIC_SITE_URL
npm run build
npm run start    # or deploy to a Node host / Vercel-style platform
```

## Backups
- Daily MySQL dump (`mysqldump`) + offsite copy.
- Back up `storage/app` (uploaded media).
- Keep `.env` backed up securely (contains secrets).

## Go-live checklist
- [ ] `APP_DEBUG=false`, fresh `APP_KEY`, production `.env`.
- [ ] HTTPS enforced; secure cookies.
- [ ] Seeded admin credentials changed.
- [ ] MySQL in use; migrations run.
- [ ] Queue worker + scheduler running.
- [ ] Storage linked, permissions set, backups scheduled.
