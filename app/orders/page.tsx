"use client";

import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Loader2, PackageOpen, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { OrderCard } from "@/components/orders/OrderCard";
import { Separator } from "@/components/ui/separator";

export default function OrdersPage() {
    const { orders, isLoading, user } = useOrders();

    // 1. Auth Guard
    if (!user) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="bg-muted/50 p-6 rounded-full mb-4">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">My Orders</h1>
                <p className="mb-6 text-muted-foreground max-w-sm">
                    Log in to track your current orders and review your purchase history.
                </p>
                <Link href="/signin?redirect=/orders">
                    <Button size="lg">Log In to View Orders</Button>
                </Link>
            </div>
        );
    }

    // 2. Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center flex-col gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your purchase history...</p>
            </div>
        );
    }

    // 3. Main Content
    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Orders</h1>
                    <p className="text-muted-foreground mt-1">
                        Check the status of recent orders, manage returns, and discover similar products.
                    </p>
                </div>
            </div>

            <Separator className="mb-8" />

            {orders.length > 0 ? (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                // 4. Empty State
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted bg-card py-24 text-center">
                    <div className="mb-6 rounded-full bg-primary/10 p-6">
                        <PackageOpen className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">No orders placed yet</h2>
                    <p className="mb-8 text-muted-foreground max-w-md">
                        Looks like you haven't bought anything yet. Explore our latest collections and find something you love!
                    </p>
                    <Link href="/shop">
                        <Button size="lg" className="font-semibold">Start Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}