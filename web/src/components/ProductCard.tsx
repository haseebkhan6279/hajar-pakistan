import Link from "next/link";
import Image from "next/image";
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
      <div className="relative overflow-hidden bg-hj-sand">
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <div className="relative aspect-[3/4]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="card-img object-cover object-top"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </div>
        </Link>
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-white/90 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-hj-muted">
            Sold out
          </span>
        )}
      </div>

      <Link href={href} className="mt-5 block text-center">
        <h3 className="font-display text-[15px] font-light uppercase tracking-[0.18em] text-hj-ink">
          {product.name}
        </h3>
        <p
          className={cn(
            "mt-2 text-[13px] tracking-wide",
            save !== null ? "text-hj-danger" : "text-hj-ink"
          )}
        >
          <Price amount={product.price} />
          {product.compareAtPrice && (
            <span className="ml-2 text-hj-muted line-through">
              <Price amount={product.compareAtPrice} />
            </span>
          )}
        </p>
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
        "grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-6 md:gap-y-16",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
