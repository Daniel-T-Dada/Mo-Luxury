import Link from "next/link";
import ProductCard from "../product/ProductCard";


export function Trending({ products }: { products: any[] }) {
    return (
        <section className="container mx-auto px-4 pb-8">
            <div className="mb-4 flex items-center justify-between">
                
                <h2 className="text-lg font-bold text-foreground">Trending Now</h2>

                
                <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
                    See All
                </Link>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (

                <div className="rounded-lg border border-dashed border-border bg-muted/40 py-10 text-center text-muted-foreground">
                    <p>No products found yet.</p>
                    <p className="text-xs mt-1 opacity-70">Sellers, start listing!</p>
                </div>
            )}
        </section >
    );
}