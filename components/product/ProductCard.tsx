"use client";

import Link from "next/link";
import { ShoppingCart, Loader2 } from "lucide-react"; // Import Loader2
import { Button } from "@/components/ui/button";
import { cn, getProductPrice, formatCurrency } from "@/lib/utils";
import { useCartAction } from "@/hooks/use-cart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "./FavoriteButton";


// Define Product Type
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    gender: string;
    stock?: number;
    campaignId?: number | null;
    campaign?: any;
}

const ProductCard = ({ product }: { product: Product }) => {
    // 1. Hook (Removed isAdded, relying on Toasts now)
    const { addToCart, isPending } = useCartAction(product);
    
    // 2. Pricing Logic
    const { final, original, isOnSale, discountPercentage } = getProductPrice(product as any);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(1);      
    };

    return (
        <Card className="group relative flex flex-col overflow-hidden transition-all hover:shadow-md pt-0">

            {/* 1. IMAGE SECTION */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                {/* Sale Badge */}
                {isOnSale && (
                    <div className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        -{discountPercentage}%
                    </div>
                )}

                {/* WRAP IMAGE IN LINK */}
                <Link href={`/shop/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.image || "https://placehold.co/400"}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Favorite Button */}
                <div className="absolute right-2 top-2 z-10">
                    <FavoriteButton
                        productId={product.id}
                        className="bg-background/80 backdrop-blur-sm shadow-sm"
                    />
                </div>
            </div>

            {/* 2. CONTENT SECTION */}
            <CardContent className="flex-1 p-3">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-muted-foreground capitalize">
                            {product.gender} • {product.category}
                        </p>

                        {/* WRAP TITLE IN LINK */}
                        <Link href={`/shop/${product.id}`}>
                            <h3 className="mt-1 text-sm font-medium text-card-foreground line-clamp-1 hover:underline">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                </div>
            </CardContent>

            {/* 3. FOOTER SECTION */}
            <CardFooter className="flex items-center justify-between p-3 pt-0">
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-foreground">
                        {formatCurrency(final)}
                    </p>
                    {isOnSale && (
                         <p className="text-[10px] text-muted-foreground line-through">
                             {formatCurrency(original)}
                         </p>
                    )}
                </div>

                <Button
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-xs transition-all active:scale-95",
                    )}
                    onClick={handleAddToCart} // ✅ Using the safe handler
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    
                    <span className="sm:hidden">Add</span>
                    <span className="hidden sm:inline">Add to Cart</span>
                </Button>
            </CardFooter>

        </Card>
    );
}

export default ProductCard;