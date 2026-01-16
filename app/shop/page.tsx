


import { getProducts } from "@/lib/services/products";
import ProductCard  from "@/components/product/ProductCard";
import ShopFilters  from "@/components/shop/ShopFilters";

interface ShopPageProps {
    searchParams: Promise<{ gender?: string; category?: string }>;
}

const ShopPage = async ({ searchParams }: ShopPageProps) => {
    // Await params in Next.js 15+ 
    const filters = await searchParams;
    const products = await getProducts(filters);

    return (
        <div className="container  mx-auto px-4 py-6">
            <div className="mb-6 flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-foreground">Shop Collections</h1>

                {/* Filter Bar */}
                <ShopFilters />
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="mt-10 flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground">No products found for this category.</p>
                </div>
            )}
        </div>
    );
}

export default ShopPage;