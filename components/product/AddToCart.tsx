

"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartAction } from "@/hooks/use-cart";

const AddToCartButton = ({ product, className }: { product: any, className?: string }) => {
    const {  addToCart, isPending } = useCartAction(product);

    return (
        <Button
            size="lg"
            className={cn("w-full md:w-auto", className)}
            onClick={(e) => {
                e.preventDefault(); 
                addToCart(1);       
            }}
            disabled={isPending || product.stock === 0}
        >
            {isPending ? (
                "Added to Cart"
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </>
            )}
        </Button>
    );
}
export default AddToCartButton;