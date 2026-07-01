<?php

namespace App\Modules\AuditLogs\Services;

use App\Modules\AuditLogs\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Records important admin/business actions to the append-only audit_logs table.
 * Call from actions/observers, e.g.:
 *   $audit->log('order.status_changed', $order, ['from' => $old, 'to' => $new]);
 */
class AuditLogger
{
    /**
     * @param  array<string, mixed>  $properties
     */
    public function log(string $action, ?Model $subject = null, array $properties = [], ?string $description = null): AuditLog
    {
        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => $subject ? $subject::class : null,
            'auditable_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties ?: null,
            'ip_address' => Request::ip(),
        ]);
    }
}
