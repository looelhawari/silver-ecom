"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { storeConfig } from "@/config";
import { apiFetch, ApiError } from "@/lib/api";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    try {
      await apiFetch("/contact", {
        method: "POST",
        body: {
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          subject: fd.get("subject"),
          message: fd.get("message"),
        },
      });
      setSent(true);
      formEl.reset();
      toast.success("Message sent — we'll be in touch.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const wa = storeConfig.contact.whatsapp.replace(/[^0-9]/g, "");

  return (
    <StorefrontShell>
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Contact us</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Questions about a piece or a custom order? We&apos;re happy to help.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--accent)]" /> {storeConfig.contact.phone}</li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--accent)]" /> {storeConfig.contact.email}</li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-[var(--accent)]" />
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:underline">
                WhatsApp us
              </a>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">{storeConfig.contact.address}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{storeConfig.contact.workingHours}</p>
        </div>

        <form className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-6" onSubmit={submit}>
          {sent && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Thanks! Your message was received.</p>}
          <input className={field} name="name" placeholder="Your name *" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="email" type="email" placeholder="Email" />
            <input className={field} name="phone" placeholder="Phone" />
          </div>
          <input className={field} name="subject" placeholder="Subject" />
          <textarea className={field} name="message" rows={5} placeholder="How can we help? *" required />
          <Button type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send message"}</Button>
        </form>
      </div>
    </StorefrontShell>
  );
}
