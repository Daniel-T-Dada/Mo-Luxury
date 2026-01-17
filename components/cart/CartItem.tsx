"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProductPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/hooks/use-cart-items";
import { Badge } from "@/components/ui/badge";

interface Props {
    item: CartItemType;
    onRemove: () => void;
    onUpdateQty: (qty: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQty }: Props) => {
    // 1. Calculate Real Price (Check for Flash Sale)
    // We treat 'item.product' as the product object.
    const { final, original, isOnSale, discountPercentage } = getProductPrice(item.product as any);

    return (
        <div className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
            {/* Image */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                />
                {/* Small Sale Badge on Image */}
                {isOnSale && (
                    <Badge variant="destructive" className="absolute top-1 left-1 px-1 py-0 text-[10px] h-5">
                        -{discountPercentage}%
                    </Badge>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                    <div className="space-y-1">
                        <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
                            {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                            {item.selectedSize && <span className="font-medium text-foreground">{item.selectedSize} • </span>}
                            {item.selectedColor && <span className="font-medium text-foreground" style={{ color: item.selectedColor.toLowerCase() }}>{item.selectedColor} • </span>}
                            {item.product.category}
                        </p>
                    </div>

                    {/* Price Column */}
                    <div className="text-right">
                        <p className="font-bold text-foreground">
                            {formatCurrency(final * item.quantity)}
                        </p>
                        {isOnSale && (
                            <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(original * item.quantity)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1 h-8">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQty(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQty(item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-muted-foreground hover:text-destructive px-2"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;