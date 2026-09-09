import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { ButtonLink } from "@/components/ui/Button";
import { SIZE_GUIDE } from "@/lib/data";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Size guide",
  description:
    "HAJAR sizing — body measurements for XS through XXL, plus how made-to-measure works for couture and bridal.",
  path: "/size-guide",
});

export default function SizeGuidePage() {
  return (
    <LegalPage
      title="Size guide"
      href="/size-guide"
      updated="1 September 2026"
      intro="These are body measurements, not garment measurements. Our pieces are cut with ease over them — if you are between sizes, take the larger one."
      sections={[
        {
          heading: "How to measure",
          body: [
            "Bust: around the fullest part, tape level and not pulled tight. Waist: at the narrowest point, usually just above the navel. Hip: around the fullest part, roughly eight inches below the waist.",
            "Measure over underwear rather than clothes, and keep the tape parallel to the floor.",
          ],
        },
        {
          heading: "Made to measure",
          body: [
            "Couture and bridal pieces from BY NAZISH ALI are cut to your own measurements after a fitting at the atelier.",
            `If you cannot come in person, message us on WhatsApp at +${SITE.whatsapp} and we will walk you through taking measurements at home.`,
          ],
        },
      ]}
    >
      <div className="overflow-x-auto border border-hj-border">
        <table className="w-full min-w-[420px] text-left text-sm">
          <caption className="sr-only">
            HAJAR size chart in inches
          </caption>
          <thead className="border-b border-hj-border bg-hj-cream text-[10px] uppercase tracking-[0.14em] text-hj-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Size
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Bust
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Waist
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Hip
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hj-border text-hj-ink-soft">
            {SIZE_GUIDE.map((r) => (
              <tr key={r.size}>
                <th scope="row" className="px-4 py-3 font-normal text-hj-ink">
                  {r.size}
                </th>
                <td className="px-4 py-3">{r.bust}</td>
                <td className="px-4 py-3">{r.waist}</td>
                <td className="px-4 py-3">{r.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ButtonLink href="/contact" variant="outline" className="mt-8">
        Ask about sizing
      </ButtonLink>
    </LegalPage>
  );
}
