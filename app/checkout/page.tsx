"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCartItems } from "@/hooks/use-cart-items";
import { processCheckout } from "@/lib/checkout";
import { toast } from "sonner";
import { CheckoutForm } from "@/components/checkout/CheckoutForm"; 
import { OrderSummary } from "@/components/checkout/OrderSummary"; 
import { getProductPrice } from "@/lib/utils";

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, isLoading } = useCartItems();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        phone: "",
    });

    const handlePayment = async () => {
        console.log("DEBUG CHECKOUT DATA:", formData);
        
        if (!formData.address || !formData.phone) {
            toast.error("Missing Details", { description: "Please fill in your shipping address." });
            return;
        }

        setIsProcessing(true);

        try {
            // Recalculate Total safely using the helper
            const subtotal = items.reduce((acc, item) => {
                const { final } = getProductPrice(item.product as any);
                return acc + (final * item.quantity);
            }, 0);
            const total = subtotal + 2500;

            // Simulate Payment
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Process Logic (Backend call)
            if (user) {
                await processCheckout(user.id, items, total, formData);

                toast.success("Payment Successful!");
                window.dispatchEvent(new Event("cart-updated"));
                router.push("/checkout/success");
            }
        } catch (error) {
            toast.error("Payment failed", { description: "Something went wrong. Please try again." });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center animate-pulse text-muted-foreground">Loading checkout...</div>;

    // Redirect if empty
    if (items.length === 0) {
        if (typeof window !== "undefined") router.push("/shop");
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Form Section */}
                <div>
                    <CheckoutForm
                        user={user}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </div>

                {/* Summary Section */}
                <div>
                    <OrderSummary
                        items={items}
                        isProcessing={isProcessing}
                        onCheckout={handlePayment}
                    />
                </div>
            </div>
        </div>
    );
}