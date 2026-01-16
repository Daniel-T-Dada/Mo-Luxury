"use client";

import Link from "next/link"; // <--- Import Link
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartAction } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "./FavourteButton";


// Define Product Type
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    gender: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    const { isAdded, addToCart, isPending } = useCartAction(product);

    return (
        <Card className="group relative flex flex-col overflow-hidden transition-all hover:shadow-md pt-0">

            {/* 1. IMAGE SECTION */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                {/* WRAP IMAGE IN LINK */}
                <Link href={`/shop/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.image || "https://placehold.co/400"}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Favorite Button (Replaced hardcoded button with Component) */}
                <div className="absolute right-2 top-2 z-10">
                    <FavoriteButton
                        productId={product.id}
                        className="bg-background/80 backdrop-blur-sm"
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
                <p className="text-sm font-bold text-foreground">
                    {formatCurrency(product.price)}
                </p>

                <Button
                    size="sm"
                    variant={isAdded ? "secondary" : "default"}
                    className={cn(
                        "h-8 px-3 text-xs transition-all active:scale-95",
                        isAdded ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={addToCart}
                    disabled={isPending}
                >
                    {isAdded ? (
                        "Added"
                    ) : (
                        <>
                            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                            <span className="sm:hidden">Add</span>
                            <span className="hidden sm:inline">Add to Cart</span>
                        </>
                    )}
                </Button>
            </CardFooter>

        </Card>
    );
}

export default ProductCard;