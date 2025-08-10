import { Product } from "@/lib/types";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  pagination: {
    totalData: number;
    page: number;
    totalPages: number;
  };
}

export default function ProductGrid({
  products,
  pagination,
}: ProductGridProps) {
  const { totalData, page, totalPages } = pagination;

  return (
    <div id="view-products" className="scroll-mt-16">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {totalData} products found
        </p>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            totalData={totalData}
            page={page}
            totalPages={totalPages}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
