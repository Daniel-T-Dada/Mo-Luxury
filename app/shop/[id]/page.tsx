import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/product/AddToCart";
import { formatCurrency } from "@/lib/utils";
import { getProductById } from "@/lib/services/products"; // <--- Import Logic

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Link href="/shop">
                    <Button>Back to Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container px-4 py-8">
            <Link href="/shop" className="mb-6 inline-block">
                <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="h-4 w-4" /> Back to Shop
                </Button>
            </Link>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                {/* Image Section */}
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center">
                    <div className="mb-4">
                        <Badge variant="secondary" className="mb-2 capitalize">
                            {product.gender} • {product.category}
                        </Badge>
                        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                            {product.name}
                        </h1>

                        <div className="mt-2 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">(4.9 reviews)</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-3xl font-bold text-primary">
                            {formatCurrency(product.price)}
                        </p>
                    </div>

                    <Separator className="mb-6" />

                    <div className="mb-8 space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                            Elevate your style with the {product.name}. Crafted with premium materials
                            designed for comfort and durability.
                        </p>
                    </div>

                    <div className="mt-auto">
                        {/* Logic for Adding to Cart is encapsulated in this Client Component */}
                        <AddToCartButton product={product} className="w-full md:w-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
}