import { Suspense } from "react";

import Footer from "@/components/Footer";
import ProductFilter from "@/components/ProductFilter";
import ProductGrid from "@/components/ProductGrid";
import ProductSearchbar from "@/components/ProductSearchbar";
import Spinner from "@/components/Spinner";
import { getFilterData, getFilteredProducts } from "@/lib/actions";

type SearchParams = Promise<{
  category?: string;
  sort?: string;
  inStock?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: string;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Get filter data (categories and price range)
  const searchParamsData = await searchParams;
  const filterData = await getFilterData();

  return (
    <div>
      <section className="max-w-7xl px-4 mx-auto py-24">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Shop
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse our selection of high-quality cooking products
            </p>
          </div>

          {/* Search form - this will submit to the same page with a search param */}
          <ProductSearchbar />

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="w-full md:w-72 shrink-0">
              <div className="space-y-6">
                <ProductFilter
                  categories={filterData.categories}
                  priceRange={filterData.priceRange}
                />
              </div>
            </div>

            {/* Products grid with suspense boundary for streaming */}
            <div className="flex-1">
              <Suspense
                key={`${searchParamsData.category}.${searchParamsData.inStock}.${searchParamsData.maxPrice}.${searchParamsData.minPrice}.${searchParamsData.page}.${searchParamsData.search}.${searchParamsData.sort}`}
                fallback={<Spinner />}
              >
                <ProductsWithFilters searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// This component fetches the filtered products
async function ProductsWithFilters({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParamsData = await searchParams;
  const { products, pagination } = await getFilteredProducts(searchParamsData);

  return <ProductGrid products={products} pagination={pagination} />;
}
