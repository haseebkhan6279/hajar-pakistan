import Link from "next/link";
import Image from "next/image";
import { QuickAdd } from "@/components/QuickAdd";
import { Price } from "@/components/currency/Price";
import { savePercent, type Product } from "@/lib/data";
import { productPath } from "@/lib/paths";
import { cn } from "@/lib/clsx";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const save = savePercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;
  const href = productPath(product.slug);

  return (
    <article className="group">
      {/* The bag button is a sibling of the link, never nested inside it */}
      <div className="relative overflow-hidden bg-hj-sand">
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <div className="relative aspect-[3/4]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="card-img object-cover"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </div>
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 z-10 bg-hj-ink px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-hj-gold-soft">
            {product.badge}
          </span>
        )}
        {save !== null && !soldOut && (
          <span className="absolute right-3 top-3 z-10 bg-hj-gold px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-hj-ink">
            −{save}%
          </span>
        )}

        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 z-10 bg-white/92 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-hj-ink-soft">
            Sold out
          </span>
        ) : (
          <QuickAdd product={product} />
        )}
      </div>

      {/* Caption — name, reference and price on one centred line */}
      <Link href={href} className="mt-4 block text-center">
        <h3 className="text-[13px] uppercase tracking-[0.08em] text-hj-ink transition-colors group-hover:text-hj-gold-deep">
          {product.name}{" "}
          <span className="text-hj-muted">({product.sku})</span>{" "}
          <span
            className={cn(
              "whitespace-nowrap",
              save !== null ? "text-hj-danger" : "text-hj-ink"
            )}
          >
            <Price amount={product.price} />
          </span>
          {product.compareAtPrice && (
            <span className="ml-2 whitespace-nowrap text-hj-muted line-through">
              <Price amount={product.compareAtPrice} />
            </span>
          )}
        </h3>
      </Link>
    </article>
  );
}

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-14",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
