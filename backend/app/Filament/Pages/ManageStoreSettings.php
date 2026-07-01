<?php

namespace App\Filament\Pages;

use App\Modules\AuditLogs\Services\AuditLogger;
use App\Modules\Settings\Models\Setting;
use App\Modules\Settings\Services\StoreSettings;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Auth;
use UnitEnum;

class ManageStoreSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.manage-store-settings';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'System';

    protected static ?string $navigationLabel = 'Settings';

    protected static ?string $title = 'Store settings';

    /** @var array<string, mixed> */
    public ?array $data = [];

    /**
     * group.key => cast type. Mirrors the seeded settings.
     *
     * @var array<string, string>
     */
    private const FIELDS = [
        'store.website_name' => 'string',
        'store.support_email' => 'string',
        'store.whatsapp_number' => 'string',
        'shipping.base_cost' => 'integer',
        'shipping.free_shipping_threshold' => 'integer',
        'tax.vat_percentage' => 'integer',
        'orders.order_prefix' => 'string',
        'orders.invoice_prefix' => 'string',
        'display.show_weight' => 'boolean',
        'display.show_workmanship_fee' => 'boolean',
        'display.show_gram_price' => 'boolean',
        'system.maintenance_mode' => 'boolean',
    ];

    public static function canAccess(): bool
    {
        return (bool) Auth::user()?->can('settings.manage');
    }

    public function mount(): void
    {
        $state = [];
        foreach (self::FIELDS as $key => $type) {
            $state[str_replace('.', '__', $key)] = StoreSettings::get($key);
        }
        $this->form->fill($state);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Store')->columns(2)->schema([
                    TextInput::make('store__website_name')->label('Website name')->required(),
                    TextInput::make('store__support_email')->label('Support email')->email(),
                    TextInput::make('store__whatsapp_number')->label('WhatsApp number'),
                ]),
                Section::make('Shipping & tax')->columns(3)->schema([
                    TextInput::make('shipping__base_cost')->label('Base shipping (EGP)')->numeric()->minValue(0),
                    TextInput::make('shipping__free_shipping_threshold')->label('Free shipping over (EGP)')->numeric()->minValue(0),
                    TextInput::make('tax__vat_percentage')->label('VAT %')->numeric()->minValue(0)->maxValue(100),
                ]),
                Section::make('Order numbering')->columns(2)->schema([
                    TextInput::make('orders__order_prefix')->label('Order prefix'),
                    TextInput::make('orders__invoice_prefix')->label('Invoice prefix'),
                ]),
                Section::make('Public display')->columns(3)->schema([
                    Toggle::make('display__show_weight')->label('Show weight'),
                    Toggle::make('display__show_workmanship_fee')->label('Show workmanship fee'),
                    Toggle::make('display__show_gram_price')->label('Show gram price'),
                ]),
                Section::make('System')->schema([
                    Toggle::make('system__maintenance_mode')->label('Maintenance mode'),
                ]),
            ]);
    }

    public function save(): void
    {
        $state = $this->form->getState();

        foreach (self::FIELDS as $key => $type) {
            [$group, $settingKey] = explode('.', $key, 2);
            $value = $state[str_replace('.', '__', $key)] ?? null;

            $value = match ($type) {
                'boolean' => (bool) $value,
                'integer' => (int) $value,
                default => $value,
            };

            Setting::updateOrCreate(
                ['group' => $group, 'key' => $settingKey],
                ['value' => $value, 'type' => $type, 'is_public' => true],
            );
        }

        StoreSettings::flush();
        app(AuditLogger::class)->log('settings.updated', null, ['keys' => array_keys(self::FIELDS)]);

        Notification::make()->title('Settings saved')->success()->send();
    }
}
