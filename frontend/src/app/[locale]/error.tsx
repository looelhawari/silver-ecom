"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  );
}
