"use client";

import { useOrders } from "@/hooks/use-orders";

import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import Link from "next/link";
import { OrderCard } from "@/components/orders/OrderCard";

export default function OrdersPage() {
    const { orders, isLoading, user } = useOrders();

    if (!user) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <p className="mb-4 text-muted-foreground">Please log in to view your orders.</p>
                <Link href="/login">
                    <Button>Log In</Button>
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-foreground">My Orders</h1>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">No orders yet</h2>
                    <p className="mb-6 text-muted-foreground">Time to make your first purchase!</p>
                    <Link href="/shop">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}