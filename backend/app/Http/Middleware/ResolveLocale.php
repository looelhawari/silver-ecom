<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class ResolveLocale
{
    /** @var array<int, string> */
    private const SUPPORTED = ['en', 'ar-EG'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->resolve($request);

        $request->attributes->set('locale', $locale);
        App::setLocale($locale === 'ar-EG' ? 'ar' : 'en');

        return $next($request);
    }

    private function resolve(Request $request): string
    {
        $queryLocale = $request->query('locale');

        if (is_string($queryLocale) && in_array($queryLocale, self::SUPPORTED, true)) {
            return $queryLocale;
        }

        $accepted = $request->getLanguages();

        foreach ($accepted as $language) {
            $normalized = str_replace('_', '-', $language);
            if (in_array($normalized, self::SUPPORTED, true)) {
                return $normalized;
            }
            if (str_starts_with($normalized, 'ar')) {
                return 'ar-EG';
            }
        }

        return 'en';
    }
}
