<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Modules\CustomOrders\Models\CustomOrderRequest;
use App\Modules\Orders\Models\Order;
use App\Modules\Users\Models\UserAddress;
use App\Modules\Users\Models\UserAdminNote;
use App\Modules\Wishlist\Models\WishlistItem;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'phone', 'whatsapp', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /** Roles permitted to access the admin dashboard. */
    public const ADMIN_ROLES = [
        'super-admin',
        'staff',
        'order-manager',
        'content-manager',
        'product-manager',
    ];

    /**
     * Authorize access to the Filament admin panel.
     *
     * Only staff/admin roles may enter the dashboard; storefront customers
     * (who hold no admin role) are rejected, including in production. Blocked
     * users are denied regardless of role.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return ! $this->is_blocked && $this->hasAnyRole(self::ADMIN_ROLES);
    }

    /** A customer is a user with no admin role. */
    public function isCustomer(): bool
    {
        return ! $this->hasAnyRole(self::ADMIN_ROLES);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_blocked' => 'boolean',
            'blocked_at' => 'datetime',
        ];
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function customOrderRequests(): HasMany
    {
        return $this->hasMany(CustomOrderRequest::class);
    }

    public function wishlistItems(): HasMany
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function adminNotes(): HasMany
    {
        return $this->hasMany(UserAdminNote::class);
    }
}
