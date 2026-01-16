


"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/hooks/use-cart-items";

interface Props {
    item: CartItemType;
    onRemove: () => void;
    onUpdateQty: (qty: number) => void;
}

const CartItem = ({ item, onRemove, onUpdateQty }: Props) => {
    return (
        <div className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
            {/* Image */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-medium text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
                    </div>
                    <p className="font-bold text-foreground">
                        {formatCurrency(item.product.price * item.quantity)}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onUpdateQty(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
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
                        className="h-8 text-muted-foreground hover:text-destructive"
                        onClick={onRemove}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="text-xs">Remove</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;