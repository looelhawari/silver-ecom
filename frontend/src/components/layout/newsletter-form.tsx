"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    if (!email) return;
    setLoading(true);
    try {
      // Recorded as a support message so the admin sees new subscribers.
      await apiFetch("/contact", {
        method: "POST",
        body: { name: "Newsletter subscriber", email, subject: "Newsletter signup", message: `Subscribe: ${email}` },
      });
      setDone(true);
      toast.success(t("subscribeSuccess"));
    } catch {
      toast.error(t("subscribeError"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return <p className="text-sm text-white/70">{t("subscribed")}</p>;
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        name="email"
        type="email"
        required
        placeholder={t("newsletterPlaceholder")}
        className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-[var(--accent)]"
      />
      <button
        type="submit"
        disabled={loading}
        aria-label={t("subscribe")}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white transition-opacity disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
