"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatPrice } from "@/lib/data";

/**
 * A PKR amount from the catalogue, shown in the viewer's chosen currency.
 *
 * Every price on the storefront goes through this. When the figure has been
 * converted the rupee amount is kept on the `title`, so the price the house
 * will actually charge is always one hover away.
 */
export function Price({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const { format, converted, code } = useCurrency();

  return (
    <span
      className={className}
      title={converted ? `Approximate — priced at ${formatPrice(amount)}` : undefined}
      data-currency={code}
    >
      {format(amount)}
    </span>
  );
}
