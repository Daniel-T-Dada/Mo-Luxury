

"use client";

import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, getProductPrice } from "@/lib/utils";

interface OrderSummaryProps {
    items: any[];
    isProcessing: boolean;
    onCheckout: () => void;
}

export function OrderSummary({ items, isProcessing, onCheckout }: OrderSummaryProps) {

    // 1. Calculate Subtotal using REAL (Discounted) Prices
    const subtotal = items.reduce((acc, item) => {
        const { final } = getProductPrice(item.product);
        return acc + (final * item.quantity);
    }, 0);

    const shippingFee = 2500;
    const total = subtotal + shippingFee;

    return (
        <Card className="sticky top-20 border-primary/10 shadow-md">
            <CardHeader className="bg-muted/50 pb-4">
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 pt-6">
                <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-3">
                        {items.map((item) => {
                            const { final, original, isOnSale } = getProductPrice(item.product as any);
                            return (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <div className="flex flex-col">
                                        <span>{item.quantity}x {item.product.name}</span>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {item.selectedSize} {item.selectedColor ? `• ${item.selectedColor}` : ""}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium block">{formatCurrency(final * item.quantity)}</span>
                                        {isOnSale && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                {formatCurrency(original * item.quantity)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <Separator />

                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{formatCurrency(shippingFee)}</span>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                </div>
            </CardContent>

            <CardFooter className="bg-muted/50 pt-6">
                <Button
                    className="w-full text-lg font-semibold shadow-lg shadow-primary/20"
                    size="lg"
                    onClick={onCheckout}
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
    );
}