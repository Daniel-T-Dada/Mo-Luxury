"use client";

import Link from "next/link";
import { ShoppingCart, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartCount } from "@/hooks/use-cart-count";
import { useFavoritesCount } from "@/hooks/use-favourites-count";


const TopNav = () => {
    const cartCount = useCartCount();
    const favCount = useFavoritesCount();

    return (
        <header className="sticky top-0 z-50 hidden w-full border-b border-border bg-background/80 backdrop-blur-md md:flex">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                    Mo Luxury
                </Link>

                <nav className="flex items-center gap-6  font-medium">
                    <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
                    <Link href="/shop" className="text-muted-foreground hover:text-primary">Shop</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/favorites">
                        <Button variant="ghost" size="icon" className="relative">
                            <Heart className="h-5 w-5" />
                            {favCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                                    {favCount}
                                </span>
                            )}
                            <span className="sr-only">Favorites</span>
                        </Button>
                    </Link>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            {/* Icon */}
                            <ShoppingCart className="h-5 w-5" />

                            {/* Badge Logic - We just check if count > 0 */}
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in">
                                    {cartCount}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>

                    <Link href="/account">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
export default TopNav;