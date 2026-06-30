<?php

namespace App\Support\Modules;

final readonly class ModuleDefinition
{
    public function __construct(
        public string $name,
        public string $slug,
        public string $path,
        public ?string $apiPrefix = null,
    ) {}

    public function apiRoutesPath(): string
    {
        return $this->path.DIRECTORY_SEPARATOR.'Routes'.DIRECTORY_SEPARATOR.'api.php';
    }

    public function hasApiRoutes(): bool
    {
        return $this->apiPrefix !== null && file_exists($this->apiRoutesPath());
    }
}
