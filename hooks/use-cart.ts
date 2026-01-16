"use client";

import { useOptimistic, useTransition } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner"; // <--- Import Sonner
import { useRouter } from "next/navigation";


export function useCartAction(product: any) {
    const { user } = useAuth();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [isAdded, setOptimisticAdded] = useOptimistic(
        false,
        (state, newItem) => true
    );

    const addToCart = async () => {
        startTransition(() => {
            setOptimisticAdded(true);
        });

        try {
            if (!user) {
                // GUEST
                const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
                const exists = localCart.find((item: any) => item.id === product.id);

                if (!exists) {
                    localCart.push({ ...product, quantity: 1 });
                    localStorage.setItem("cart", JSON.stringify(localCart));
                    toast.success("Added to cart"); // <--- Feedback
                    window.dispatchEvent(new Event("storage"));
                } else {
                    toast.info("Item already in cart");
                }
            } else {
                // USER
                await apiRequest("/carts", {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        productId: product.id,
                        quantity: 1,
                    }),
                });
                toast.success("Added to cart"); // <--- Feedback
                router.refresh(); // Refresh to update cart state from server
                // Inside addToCart... success block
                window.dispatchEvent(new Event("cart-updated"));
            }
        } catch (error) {
            console.error("Cart error:", error);
            toast.error("Failed to add item"); // <--- Error Feedback
            // In a real scenario, you'd trigger a rollback here
        }
    };

    return { isAdded, addToCart, isPending };
}