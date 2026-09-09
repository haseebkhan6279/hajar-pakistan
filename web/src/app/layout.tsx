import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PromoBanner } from "@/components/PromoBanner";
import { CookieConsent } from "@/components/CookieConsent";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from "@/components/cart/CartProvider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import { organizationSchema, rootMetadata, websiteSchema } from "@/lib/seo";
import { getRates } from "@/lib/currency";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = rootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* One snapshot for the whole tree, so every price on a page converts off
     the same rates. Cached for twelve hours — see lib/currency. */
  const rates = await getRates();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-hj-canvas text-hj-ink antialiased"
        style={{ fontFamily: "var(--font-jost), ui-sans-serif, system-ui" }}
        suppressHydrationWarning
      >
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Analytics />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-hj-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <CurrencyProvider rates={rates}>
          <CartProvider>
            <PromoBanner />
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <CartDrawer />
            <CookieConsent />
            <WhatsAppButton />
            <BackToTop />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
