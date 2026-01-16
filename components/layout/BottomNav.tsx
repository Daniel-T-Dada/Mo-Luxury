"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/hooks/use-cart-count";
import { useFavoritesCount } from "@/hooks/use-favourites-count"; // Ensure this filename matches your file

const BottomNav = () => {
    const pathname = usePathname();
    const cartCount = useCartCount();
    const favCount = useFavoritesCount();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/shop", label: "Shop", icon: ShoppingBag },
        { href: "/favorites", label: "Favorites", icon: Heart },
        { href: "/cart", label: "Cart", icon: ShoppingCart },
        { href: "/account", label: "Account", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-safe md:hidden">
            <nav className="flex h-16 items-center justify-around px-2">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    const isCart = label === "Cart";
                    const isFav = label === "Favorites"; // Check if this is the favorites item

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                {/* Fill icon if active */}
                                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />

                                {/* Cart Badge (Red/Destructive) */}
                                {isCart && cartCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}

                                {/* Favorites Badge (Primary Color) */}
                                {isFav && favCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                                        {favCount}
                                    </span>
                                )}
                            </div>
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
export default BottomNav;