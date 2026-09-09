/**
 * Display currencies.
 *
 * HAJAR prices, sells and settles in PKR — the catalogue stores PKR, the order
 * records PKR, and the product structured data advertises PKR. Everything here
 * is a courtesy conversion for the international customer reading the site, so
 * every converted figure is labelled indicative and nothing downstream of the
 * basket ever sees anything but rupees.
 */

export type CurrencyCode = "PKR" | "USD" | "GBP" | "EUR" | "AED" | "SAR";

export type Currency = {
  code: CurrencyCode;
  /** Shown beside the code in the switcher */
  name: string;
  /** The locale the amount is formatted in. See NON_BASE_LOCALE below. */
  locale: string;
};

export const BASE: CurrencyCode = "PKR";

/*
  Non-base amounts are all formatted in en-US rather than each currency's own
  home locale. That is deliberate: de-DE renders EUR as "610 €" and en-GB
  renders GBP as "£520", so a per-locale table would put the symbol on a
  different side of the number depending on which currency was picked. One
  locale keeps the switcher's output in a single shape.
*/
const NON_BASE_LOCALE = "en-US";

export const CURRENCIES: Currency[] = [
  { code: "PKR", name: "Pakistani Rupee", locale: "en-PK" },
  { code: "USD", name: "US Dollar", locale: NON_BASE_LOCALE },
  { code: "GBP", name: "Pound Sterling", locale: NON_BASE_LOCALE },
  { code: "EUR", name: "Euro", locale: NON_BASE_LOCALE },
  { code: "AED", name: "UAE Dirham", locale: NON_BASE_LOCALE },
  { code: "SAR", name: "Saudi Riyal", locale: NON_BASE_LOCALE },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export function isCurrencyCode(v: unknown): v is CurrencyCode {
  return typeof v === "string" && (CURRENCY_CODES as string[]).includes(v);
}

export function currencyByCode(code: CurrencyCode): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Units of the named currency per 1 PKR. */
export type Rates = Record<CurrencyCode, number>;

/**
 * The fallback, used when the rate feed is unreachable — at build time on a
 * machine with no network, or if the endpoint is down when a page revalidates.
 *
 * These go stale. They are a floor under the feature, not a source of truth:
 * the site says "indicative" wherever a converted figure appears, precisely so
 * that a stale fallback misleads no one. Worth re-pinning once a year or so.
 *
 * Reviewed 2026-09-09.
 */
export const PINNED_RATES: Rates = {
  PKR: 1,
  USD: 0.003603,
  GBP: 0.002661,
  EUR: 0.0031,
  AED: 0.013231,
  SAR: 0.01351,
};

const RATES_URL = "https://open.er-api.com/v6/latest/PKR";

/** Twelve hours. Rates move far too little to be worth a tighter window. */
const RATES_TTL_SECONDS = 43_200;

/**
 * A feed rate is taken only if it lands within an order of magnitude of the
 * pinned one. That is wide enough to absorb any real move in the rupee and
 * narrow enough to reject the ways this endpoint can go wrong quietly —
 * a rate quoted per unit instead of per rupee, or an inverted pair, both of
 * which arrive as a plausible-looking number that is out by ~10^5.
 */
function plausible(code: CurrencyCode, rate: unknown): rate is number {
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return false;
  const pinned = PINNED_RATES[code];
  return rate > pinned / 10 && rate < pinned * 10;
}

/**
 * Live rates, falling back per currency rather than all at once — one bad or
 * missing pair should not throw away five good ones.
 *
 * Cached by Next for RATES_TTL_SECONDS, so this is one request per twelve
 * hours across the whole site, not one per render.
 */
export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch(RATES_URL, {
      next: { revalidate: RATES_TTL_SECONDS },
    });
    if (!res.ok) return PINNED_RATES;

    const body: unknown = await res.json();
    const feed =
      typeof body === "object" && body !== null
        ? (body as { result?: string; rates?: Record<string, unknown> })
        : null;
    if (feed?.result !== "success" || !feed.rates) return PINNED_RATES;

    const rates = { ...PINNED_RATES };
    for (const { code } of CURRENCIES) {
      if (code === BASE) continue;
      const rate = feed.rates[code];
      if (plausible(code, rate)) rates[code] = rate;
    }
    return rates;
  } catch {
    // Offline build, DNS failure, timeout — the site still prices in rupees.
    return PINNED_RATES;
  }
}

/**
 * Converted and rounded to whole units.
 *
 * Couture sits in the tens of thousands of rupees, so the minor unit carries
 * no information — "$664.73" reads as a quoted price the house will honour,
 * which is exactly what an indicative figure must not do. Whole units read as
 * the approximation they are.
 */
export function convert(amountPkr: number, code: CurrencyCode, rates: Rates) {
  if (code === BASE) return amountPkr;
  return Math.round(amountPkr * (rates[code] ?? PINNED_RATES[code]));
}

export function formatMoney(amount: number, code: CurrencyCode) {
  return new Intl.NumberFormat(currencyByCode(code).locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
