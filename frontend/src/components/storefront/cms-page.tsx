import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { apiFetch, ApiError } from "@/lib/api";

type Page = { slug: string; title: string; body?: string | null };

export async function fetchPage(slug: string): Promise<Page | null> {
  try {
    const res = await apiFetch<{ data: Page }>(`/pages/${slug}`, { cache: "no-store" });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function CmsPage({ slug }: { slug: string }) {
  const page = await fetchPage(slug);
  if (!page) notFound();

  return (
    <StorefrontShell>
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{page.title}</h1>
        <div className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[var(--muted-foreground)]">
          {page.body}
        </div>
      </article>
    </StorefrontShell>
  );
}
