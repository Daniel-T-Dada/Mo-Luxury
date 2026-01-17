"use client";

import { useTransition } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner"; // ✅ Using Sonner
import { useRouter } from "next/navigation";

export function useCartAction(product: any) {
    const { user } = useAuth();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // We accept options now!
    const addToCart = async (quantity: number = 1, size?: string, color?: string) => {

        startTransition(async () => {
            try {
                if (!user) {
                    // GUEST LOGIC
                    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

                    // Check if SAME product with SAME variation exists
                    const existingItem = localCart.find((item: any) =>
                        item.id === product.id &&
                        item.selectedSize === size &&
                        item.selectedColor === color
                    );

                    if (existingItem) {
                        existingItem.quantity += quantity;
                        toast.info("Cart updated", { description: `Increased quantity of ${product.name}` });
                    } else {
                        localCart.push({
                            ...product,
                            quantity,
                            selectedSize: size,
                            selectedColor: color
                        });
                        toast.success("Added to cart");
                    }

                    localStorage.setItem("cart", JSON.stringify(localCart));
                    window.dispatchEvent(new Event("storage"));
                    window.dispatchEvent(new Event("cart-updated"));
                } else {
                    // USER LOGIC
                    await apiRequest("/carts", {
                        method: "POST",
                        body: JSON.stringify({
                            userId: user.id,
                            productId: product.id,
                            quantity,
                            // Note: Ensure your Backend/DB Schema supports these fields!
                            selectedSize: size,
                            selectedColor: color
                        }),
                    });

                    toast.success("Added to cart");
                    router.refresh();
                    window.dispatchEvent(new Event("cart-updated"));
                }
            } catch (error) {
                console.error("Cart error:", error);
                toast.error("Failed to add item");
            }
        });
    };

    return { addToCart, isPending };
}