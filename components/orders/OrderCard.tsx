"use client";

import Image from "next/image";
import { Calendar, MapPin, ChevronRight, PackageSearch } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/hooks/use-orders";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderCard({ order }: { order: Order }) {
    // ✅ FIX 1: Use 'order.date' only. The API maps 'createdAt' to 'date'.
    const orderDate = new Date(order.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Card className="overflow-hidden border-border bg-card transition-all hover:shadow-md">
            {/* Header: Quick Summary */}
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b bg-muted/30 p-4 sm:p-6">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Order Placed</p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {orderDate}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Total Amount</p>
                    <p className="text-sm font-bold text-primary">{formatCurrency(order.total)}</p>
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Order #</p>
                    <p className="text-sm font-medium font-mono">{order.id}</p>
                </div>

                <div className="ml-auto">
                    <OrderStatusBadge status={order.status} />
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="grid gap-6 p-6 md:grid-cols-[2fr_1fr]">

                {/* Left: Product List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                    <div className="flex flex-col gap-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex gap-4 group">
                                {/* Image */}
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                                    <Image
                                        src={item.product.image || "/placeholder.png"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col justify-center">
                                    <h4 className="font-semibold text-foreground line-clamp-1">{item.product.name}</h4>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {item.product.category} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                                    </p>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                                        <span className="text-sm font-medium">
                                            {formatCurrency(item.product.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Shipping Info */}
                <div className="rounded-lg bg-muted/20 p-4 h-fit border border-border/50">
                    <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                        <MapPin className="h-4 w-4 text-primary" /> Delivery Details
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                        {/* ✅ FIX 2: Removed order.shipping.name (User) */}
                        <p className="font-medium text-foreground">Shipping Address</p>
                        <p>{order.shipping?.address}</p>
                        <p>{order.shipping?.city}</p>
                        {/* Optional chaining for phone in case it's missing */}
                        <p>{order.shipping?.phone}</p>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{formatCurrency(2500)}</span>
                    </div>
                </div>

            </CardContent>

            {/* Footer: Actions */}
            <CardFooter className="bg-muted/30 p-4 flex flex-col sm:flex-row justify-end gap-3 border-t">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <PackageSearch className="mr-2 h-4 w-4" /> Track Order
                </Button>
                <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                    View Invoice <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}