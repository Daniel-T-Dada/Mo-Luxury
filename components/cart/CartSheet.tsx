

"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartItems } from "@/hooks/use-cart-items";
import { formatCurrency } from "@/lib/utils";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import  CartItem  from "./CartItem";

const CartSheet = ({ children }: { children: React.ReactNode }) => {
    const { items, isLoading, removeItem, updateQuantity } = useCartItems();
    const { user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Calculate Total
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handleCheckout = () => {
        setIsOpen(false); // Close sheet
        if (!user) {
            toast.info("Please Sign in to complete your purchase");
            router.push("/signin?redirect=/checkout");
        } else {
            router.push("/checkout");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>

            {/* Mobile-first: w-full on tiny screens, sm:max-w-md on larger */}
            <SheetContent side="right" className="flex w-full flex-col pr-0 sm:max-w-md">
                <SheetHeader className="px-1 text-left">
                    <SheetTitle>My Cart ({items.length})</SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                {/* Scrollable Item List */}
                <ScrollArea className="flex-1 pr-4">
                    {items.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id || item.productId}
                                    item={item}
                                    onRemove={() => removeItem(item.id, item.productId)}
                                    onUpdateQty={(qty) => updateQuantity(item.id, item.productId, qty)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-[50vh] flex-col items-center justify-center space-y-2 text-center">
                            <div className="rounded-full bg-muted p-4">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">Your cart is empty.</p>
                            <SheetClose asChild>
                                <Button variant="link" className="text-primary">
                                    Start Shopping
                                </Button>
                            </SheetClose>
                        </div>
                    )}
                </ScrollArea>

                {/* Fixed Footer for Checkout */}
                {items.length > 0 && (
                    <div className="space-y-4 pr-6 pt-6">
                        <Separator />
                        <div className="flex items-center justify-between text-base font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

export default CartSheet;