import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PREFIX}/products/single-product/${id}`
  );
  const data = await res.json();

  if (!data.success)
    return (
      <p className="pt-24 text-center">
        Sorry, couldn&apos;t find the product. Please try again
      </p>
    );

  return (
    <div>
      <section className="max-w-7xl px-4 mx-auto py-24 scroll-mt-16">
        <ProductDetail product={data.data} />
      </section>

      <Footer />
    </div>
  );
}
