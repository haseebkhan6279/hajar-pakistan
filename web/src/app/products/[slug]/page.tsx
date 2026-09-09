import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProduct, getProducts, getRelated } from "@/lib/catalog";
import { categoryPath, productPath } from "@/lib/paths";
import { breadcrumbSchema, productMetadata, productSchema } from "@/lib/seo";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.slice(0, 50).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Piece not found" };
  return productMetadata(product);
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product, 4);

  const trail = [
    { name: "Home", href: "/" },
    { name: product.category, href: categoryPath(product.categorySlug) },
    { name: product.name, href: productPath(product.slug) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <JsonLd data={[productSchema(product), breadcrumbSchema(trail)]} />
      <Breadcrumbs trail={trail} />

      <div className="mt-10">
        <ProductDetailClient product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t border-hj-border pt-16">
          <SectionHeading
            eyebrow="You may also like"
            title="More from the atelier"
          />
          <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
