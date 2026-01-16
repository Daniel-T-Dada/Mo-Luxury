

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCartItems } from "@/hooks/use-cart-items";
import { processCheckout } from "@/lib/checkout";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Lock, Truck } from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

    // Calculate Total
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingFee = 2500; // Flat rate for mock
    const total = subtotal + shippingFee;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.address || !formData.phone) {
            toast.error("Please fill in your shipping details");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Simulate Payment Delay (2 seconds)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // 2. Process Backend (Create Order, Delete Cart)
            if (user) {
                await processCheckout(user.id, items, total, formData);

                // 3. Success!
                toast.success("Payment Successful!");
                window.dispatchEvent(new Event("cart-updated")); // Clear nav badge
                router.push("/checkout/success");
            }
        } catch (error) {
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading checkout...</div>;
    if (items.length === 0) {
        router.push("/shop"); // Redirect if empty
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* LEFT COLUMN: Shipping Form */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" /> Shipping Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handlePayment} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={user?.name} disabled className="bg-muted" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="08012345678"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="123 Street Name"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City / State</Label>
                                    <Input
                                        id="city"
                                        placeholder="Lagos"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Order Summary */}
                <div>
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {/* Item List (Mini) */}
                            <div className="max-h-[200px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between py-2 text-sm">
                                        <span>{item.quantity}x {item.product.name}</span>
                                        <span className="font-medium">
                                            {formatCurrency(item.product.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatCurrency(shippingFee)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">{formatCurrency(total)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                form="checkout-form" // Connects to the form ID above
                                className="w-full"
                                size="lg"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Pay {formatCurrency(total)}
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}