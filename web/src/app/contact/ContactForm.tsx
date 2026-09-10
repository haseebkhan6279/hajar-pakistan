"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/seo";

const SUBJECTS = [
  "Sizing help",
  "Made to order",
  "Bridal appointment",
  "Visit the Lahore atelier",
  "Order status",
  "Something else",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000/api";

const field =
  "h-12 w-full border border-hj-border bg-white px-3.5 text-sm text-hj-ink transition-colors focus:border-hj-gold focus:outline-none";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);

  /**
   * Two things happen, in this order and for different reasons.
   *
   * The enquiry is recorded on the API first, so it lands in the dashboard
   * inbox whether or not the sender ever opens WhatsApp — an appointment
   * request that only existed as a draft message used to disappear the moment
   * someone closed the tab.
   *
   * WhatsApp still opens afterwards, because that is the channel the atelier
   * answers on and people expect the reply there. A failed save must not cost
   * the customer that, so the window opens either way and the copy only
   * softens to "we may not have a record" when the save did not land.
   */
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    let recorded = false;
    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
          company: String(fd.get("company") ?? ""),
        }),
      });
      recorded = res.ok;
    } catch {
      recorded = false;
    }

    const text = [
      `Name: ${name}`,
      `Subject: ${subject}`,
      email ? `Email: ${email}` : "",
      phone ? `Phone: ${phone}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );

    setSaved(recorded);
    setSent(true);
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="mt-8">
        <p className="font-display text-2xl text-hj-ink">
          {saved ? "We have your enquiry." : "Your message is on its way."}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-hj-muted">
          {saved
            ? "It is with the atelier now, and we have opened WhatsApp so you can send it there too. We usually reply the same day."
            : "We have opened WhatsApp with your message ready to send. Please send it there, or write to us directly at "}
          {!saved && (
            <a
              href={`mailto:${SITE.email}`}
              className="text-hj-gold-deep underline"
            >
              {SITE.email}
            </a>
          )}
          {!saved && "."}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="tap-target mt-6 text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <label className="block">
        <span className="eyebrow">Your name</span>
        <input name="name" required className={`${field} mt-2`} />
      </label>

      <label className="block">
        <span className="eyebrow">Email (optional)</span>
        <input name="email" type="email" className={`${field} mt-2`} />
      </label>

      <label className="block">
        <span className="eyebrow">Phone or WhatsApp (optional)</span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={`${field} mt-2`}
        />
      </label>

      <label className="block">
        <span className="eyebrow">Subject</span>
        <select name="subject" defaultValue={SUBJECTS[0]} className={`${field} mt-2`}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="eyebrow">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us what you are looking for…"
          className="mt-2 w-full border border-hj-border bg-white px-3.5 py-3 text-sm text-hj-ink transition-colors focus:border-hj-gold focus:outline-none"
        />
      </label>

      {/* Honeypot. Not display:none — some bots skip hidden inputs, and a
          screen reader is told to skip it by aria-hidden + tabIndex. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="flex h-13 w-full items-center justify-center bg-hj-ink py-4 text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send enquiry"}
      </button>

      <p className="text-[11px] leading-relaxed text-hj-muted">
        We usually reply the same day. Bridal appointments are confirmed by
        phone. Sending also opens WhatsApp so you can reach us there.
      </p>
    </form>
  );
}
