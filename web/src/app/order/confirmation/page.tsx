import { Suspense } from "react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/Brand";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ order?: string }>;

async function Confirmation({ searchParams }: { searchParams: SearchParams }) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center md:py-32">
      <LogoMark size={56} className="mx-auto" />

      <h1 className="mt-10 font-display text-5xl leading-tight text-hj-ink">
        Thank you.
      </h1>
      <div className="rule-gold mx-auto mt-6 h-px w-24" />

      <p className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-hj-muted">
        Your request is with us. Our team will be in touch to confirm the
        details and arrange payment — an order is confirmed once payment has
        been received.
      </p>

      {order && (
        <div className="mx-auto mt-10 inline-block border border-hj-border bg-hj-cream px-8 py-5">
          <p className="eyebrow">Order number</p>
          <p className="mt-2 font-mono text-lg text-hj-ink">{order}</p>
        </div>
      )}

      <dl className="mx-auto mt-12 grid max-w-lg gap-6 border-t border-hj-border pt-10 text-left sm:grid-cols-3">
        {[
          ["Payment", "Arranged on confirmation"],
          ["Made to order", "Approx. 5–6 weeks"],
          ["Questions", SITE.whatsappDisplay],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-2 text-sm text-hj-ink-soft">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/products">Continue shopping</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-32 text-center text-sm text-hj-muted">
          Confirming your order…
        </div>
      }
    >
      <Confirmation searchParams={searchParams} />
    </Suspense>
  );
}
