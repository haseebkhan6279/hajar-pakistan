"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BASE,
  convert,
  currencyByCode,
  formatMoney,
  isCurrencyCode,
  type Currency,
  type CurrencyCode,
  type Rates,
} from "@/lib/currency";
import { formatPrice } from "@/lib/data";

const STORAGE_KEY = "hj-currency";

type CurrencyContextValue = {
  code: CurrencyCode;
  currency: Currency;
  setCode: (code: CurrencyCode) => void;
  /** A PKR amount, rendered in the viewer's currency. */
  format: (amountPkr: number) => string;
  /** The same amount as a number, for anything that needs to do its own sums. */
  convert: (amountPkr: number) => number;
  /** False until the stored choice has been read — see the note below. */
  ready: boolean;
  /** True once the viewer is looking at something other than rupees. */
  converted: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/**
 * Holds the viewer's display currency.
 *
 * `rates` come down from the server so every price on a page converts off one
 * snapshot — fetching them here would mean a second network round trip on
 * every visit and a page that prices itself twice.
 *
 * The selection cannot be read during the first render. Catalogue pages are
 * prerendered, so their HTML is always in rupees; reading localStorage before
 * the first paint would make the client's tree disagree with that HTML and
 * React would throw the whole subtree away. So the first client render is
 * rupees too, and `ready` flips in an effect straight after — the swap is one
 * frame, and only for viewers who have chosen another currency.
 */
export function CurrencyProvider({
  rates,
  children,
}: {
  rates: Rates;
  children: ReactNode;
}) {
  const [code, setCodeState] = useState<CurrencyCode>(BASE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isCurrencyCode(stored)) setCodeState(stored);
    } catch {
      // blocked or unavailable storage — the site prices in rupees
    }
    setReady(true);
  }, []);

  const setCode = useCallback((next: CurrencyCode) => {
    setCodeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // the choice still holds for this session
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const active = ready ? code : BASE;
    return {
      code: active,
      currency: currencyByCode(active),
      setCode,
      convert: (amountPkr: number) => convert(amountPkr, active, rates),
      format: (amountPkr: number) =>
        active === BASE
          ? formatPrice(amountPkr)
          : formatMoney(convert(amountPkr, active, rates), active),
      ready,
      converted: active !== BASE,
    };
  }, [code, ready, rates, setCode]);

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
