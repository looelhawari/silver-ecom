<?php

namespace App\Modules\Media\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Shared secure file storage for API-driven uploads (custom-order reference
 * images, payment proofs). Filenames are never trusted: every file is renamed
 * to a random token + safe extension and stored on the configured disk.
 *
 * MIME/extension/size validation is enforced by the calling Form Request; this
 * service performs a final extension allow-list check as defence in depth.
 */
class MediaService
{
    /** @var array<int, string> */
    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

    /** @var array<int, string> */
    private const PROOF_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];

    public function storeImage(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        return $this->store($file, $directory, self::IMAGE_EXTENSIONS, $disk);
    }

    public function storeProof(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        return $this->store($file, $directory, self::PROOF_EXTENSIONS, $disk);
    }

    /**
     * @param  array<int, string>  $allowedExtensions
     */
    private function store(UploadedFile $file, string $directory, array $allowedExtensions, string $disk): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: '');

        if (! in_array($extension, $allowedExtensions, true)) {
            abort(422, 'Unsupported file type.');
        }

        $name = Str::random(40).'.'.$extension;

        return $file->storeAs(trim($directory, '/'), $name, $disk);
    }

    public function url(string $path, string $disk = 'public'): string
    {
        return Storage::disk($disk)->url($path);
    }
}
