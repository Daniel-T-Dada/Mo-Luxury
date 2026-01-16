

"use client";

import { useCartItems } from "@/hooks/use-cart-items";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CartItem from "@/components/cart/CartItem";

export default function CartPage() {
    const { items, isLoading, removeItem, updateQuantity } = useCartItems();
    const { user } = useAuth();
    const router = useRouter();

    // Calculate Total
    const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!user) {
            // REQUIREMENT: Redirect to login with message if guest
            toast.info("Please Sign in to complete your purchase");
            // We pass ?redirect=/checkout so they come back to a checkout page (which we will build next)
            router.push("/signin?redirect=/checkout");
        } else {
            // If logged in, go to checkout/payment
            router.push("/checkout");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-foreground">Shopping Cart ({items.length})</h1>

            {items.length > 0 ? (
                <div className="grid gap-6">
                    <div className="grid gap-4">
                        {items.map((item) => (
                            <CartItem
                                key={item.id || item.productId} // Fallback for guest IDs
                                item={item}
                                onRemove={() => removeItem(item.id, item.productId)}
                                onUpdateQty={(qty) => updateQuantity(item.id, item.productId, qty)}
                            />
                        ))}
                    </div>

                    {/* Summary Section */}
                    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between text-lg font-medium">
                            <span>Total</span>
                            <span className="font-bold text-primary">{formatCurrency(total)}</span>
                        </div>

                        <Button className="w-full text-base font-bold" size="lg" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>

                        {!user && (
                            <p className="mt-3 text-center text-xs text-muted-foreground">
                                You will be asked to login to complete your purchase.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-6">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold">Your cart is empty</h2>
                    <p className="mb-6 text-muted-foreground">Looks like you haven't added anything yet.</p>
                    <Link href="/shop">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}