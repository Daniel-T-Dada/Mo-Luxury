"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import { Product } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/use-countdown";
import { formatCurrency } from "@/lib/utils";


// Sub-component for the time box (Pure UI)
const TimeBox = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center justify-center w-16 h-16 bg-background/90 rounded-md shadow-sm backdrop-blur-sm">
        <span className="text-xl font-bold leading-none text-destructive">
            {val.toString().padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase font-medium text-muted-foreground">{label}</span>
    </div>
);

interface FlashSalesProps {
    products: Product[];
}

const FlashSales = ({ products }: FlashSalesProps) => {
    // 1. Use the Hook
    const { hours, minutes, seconds } = useCountdown(24);

    const flashProducts = products.filter(p => p.stock > 0).slice(0, 4);
    if (flashProducts.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            {/* Header Section 
         - Uses 'bg-destructive' (Red in standard themes) for the urgency background.
         - Uses 'text-destructive-foreground' (White) for contrast.
      */}
            <div className="relative overflow-hidden rounded-2xl bg-destructive p-6 shadow-lg mb-8">

                {/* Background Effects */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">

                    {/* Text Content */}
                    <div className="text-destructive-foreground">
                        <div className="mb-2 flex items-center gap-2">
                            <Timer className="h-6 w-6 animate-pulse" />
                            <h2 className="text-sm font-bold uppercase tracking-widest opacity-90">Flash Sale</h2>
                        </div>
                        <h3 className="text-3xl font-extrabold md:text-4xl">Hurry Up!</h3>
                        <p className="mt-1 font-medium opacity-90">Ends in:</p>
                    </div>

                    {/* Timer & Action */}
                    <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                            <TimeBox val={hours} label="Hrs" />
                            <TimeBox val={minutes} label="Mins" />
                            <TimeBox val={seconds} label="Secs" />
                        </div>

                        <Link href="/shop" className="hidden md:block">
                            <Button variant="secondary" className="font-semibold">
                                View All <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {flashProducts.map((product) => {

                    // 👇 REAL MATH LOGIC
                    const totalInventory = product.stock + product.sold;
                    // Avoid division by zero if a new product has 0 stock & 0 sold
                    const percentageSold = totalInventory > 0
                        ? Math.round((product.sold / totalInventory) * 100)
                        : 0;

                    return (
                        <Link href={`/shop/${product.id}`} key={product.id} className="group">
                            <Card className="overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300 pt-0">
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    <Badge variant="destructive" className="absolute left-2 top-2 z-10">
                                        -30%
                                    </Badge>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="truncate font-medium">{product.name}</h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="font-bold text-destructive">
                                            {formatCurrency(product.price * 0.7)}
                                        </span>
                                        <span className="text-xs text-muted-foreground line-through">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>

                                    {/* 👇 REAL STOCK BAR */}
                                    <div className="mt-3">
                                        <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                                            <span>Available: {product.stock}</span>
                                            <span>Sold: {product.sold}</span>
                                        </div>

                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full rounded-full bg-destructive transition-all duration-500"
                                                style={{ width: `${percentageSold}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
export { FlashSales };