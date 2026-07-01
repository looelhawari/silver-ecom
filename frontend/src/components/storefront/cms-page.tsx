import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { apiFetch, ApiError } from "@/lib/api";
import { localizedField, normalizeLocale } from "@/lib/locale";

type Page = {
  slug: string;
  title: string;
  title_en?: string | null;
  title_ar?: string | null;
  body?: string | null;
  body_en?: string | null;
  body_ar?: string | null;
  content?: string | null;
  content_en?: string | null;
  content_ar?: string | null;
};

export async function fetchPage(slug: string, locale?: string): Promise<Page | null> {
  try {
    const res = await apiFetch<{ data: Page }>(`/pages/${slug}`, { cache: "no-store", locale });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function CmsPage({ slug }: { slug: string }) {
  const locale = normalizeLocale(await getLocale());
  const page = await fetchPage(slug, locale);
  if (!page) notFound();
  const title = localizedField(page, "title", locale);
  const body = localizedField({ ...page, body: page.content ?? page.body }, "body", locale) ||
    localizedField(page, "content", locale);

  return (
    <StorefrontShell>
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{title}</h1>
        <div className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[var(--muted-foreground)]">
          {body}
        </div>
      </article>
    </StorefrontShell>
  );
}
