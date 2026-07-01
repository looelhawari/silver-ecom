<?php

namespace App\Modules\Support\Models;

use Illuminate\Database\Eloquent\Model;

class SupportMessage extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'subject', 'message', 'status', 'admin_note',
    ];
}
