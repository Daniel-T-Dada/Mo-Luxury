"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartAction } from "@/hooks/use-cart"; // 👈 Real Hook
import { toast } from "sonner"; // 👈 Real Toasts

interface ProductFormProps {
    product: any;
}

const ProductForm = ({ product }: ProductFormProps) => {
    // 1. State for User Selections
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    // 2. Connect the Hook
    const { addToCart, isPending } = useCartAction(product);

    const handleAddToCart = () => {
        // Validation: Strict check for Variants
        if (product.sizes?.length > 0 && !selectedSize) {
            toast.error("Size Required", {
                description: "Please select a size to continue."
            });
            return;
        }

        if (product.colors?.length > 0 && !selectedColor) {
            toast.error("Color Required", {
                description: "Please select a color to continue."
            });
            return;
        }

        // Execute Real Action
        addToCart(1, selectedSize || undefined, selectedColor || undefined);
    };

    return (
        <div className="space-y-6">

            {/* SIZE SELECTOR */}
            {product.sizes && product.sizes.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Select Size</h3>
                    <div className="flex flex-wrap gap-3">
                        {product.sizes.map((size: string) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "w-12 h-12 rounded-full border flex items-center justify-center text-sm font-medium transition-all",
                                    // ✅ Semantic Colors: Primary (Dark) vs Background (Light)
                                    selectedSize === size
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-input hover:border-primary"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* COLOR SELECTOR */}
            {product.colors && product.colors.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Select Color</h3>
                    <div className="flex flex-wrap gap-3">
                        {product.colors.map((color: string) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedColor === color
                                        ? "border-primary scale-110 shadow-sm" // Active Ring
                                        : "border-transparent hover:scale-110"
                                )}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ACTION BUTTON */}
            <div className="flex flex-col gap-3">
                <Button
                    size="lg"
                    className="w-full md:w-2/3 h-12 text-lg gap-2 font-semibold"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isPending}
                // ✅ "Constructive" variant (default primary)
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ShoppingCart className="w-5 h-5" />
                    )}
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                {/* STOCK WARNING */}
                {product.stock > 0 && product.stock < 5 && (
                    // ✅ Semantic "Destructive" color for warnings
                    <p className="text-destructive text-sm font-medium animate-pulse flex items-center gap-1">
                        🔥 Hurry! Only {product.stock} left in stock.
                    </p>
                )}
            </div>
        </div>
    );
}

export { ProductForm };