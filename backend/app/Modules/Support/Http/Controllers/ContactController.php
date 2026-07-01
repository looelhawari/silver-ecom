<?php

namespace App\Modules\Support\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Support\Http\Requests\StoreContactRequest;
use App\Modules\Support\Models\SupportMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        $message = SupportMessage::create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Thanks — your message has been received. We will get back to you soon.',
            'data' => ['id' => $message->id],
        ], 201);
    }
}
