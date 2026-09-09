"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/seo";

const SUBJECTS = [
  "Sizing help",
  "Made to order",
  "Bridal appointment",
  "Order status",
  "Something else",
];

const field =
  "h-12 w-full border border-hj-border bg-white px-3.5 text-sm text-hj-ink transition-colors focus:border-hj-gold focus:outline-none";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  /**
   * There is no inbox on the API yet, so the form composes a WhatsApp
   * message — the channel the atelier actually answers on.
   */
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = [
      `Name: ${fd.get("name")}`,
      `Subject: ${fd.get("subject")}`,
      fd.get("email") ? `Email: ${fd.get("email")}` : "",
      "",
      String(fd.get("message") ?? ""),
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8">
        <p className="font-display text-2xl text-hj-ink">
          Your message is on its way.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-hj-muted">
          We have opened WhatsApp with your message ready to send. If nothing
          appeared, write to us directly at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-hj-gold-deep underline"
          >
            {SITE.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[11px] uppercase tracking-[0.14em] text-hj-gold-deep hover:underline"
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

      <button
        type="submit"
        className="flex h-13 w-full items-center justify-center bg-hj-ink py-4 text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
      >
        Send via WhatsApp
      </button>

      <p className="text-[11px] leading-relaxed text-hj-muted">
        We usually reply the same day. Bridal appointments are confirmed by
        phone.
      </p>
    </form>
  );
}
