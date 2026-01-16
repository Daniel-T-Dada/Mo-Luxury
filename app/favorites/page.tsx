"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

import { Button } from "@/components/ui/button";
import { Loader2, Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState < any[] > ([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchFavorites = async () => {
            try {
                // json-server magic: _expand=product gets the full product object based on productId
                const data = await apiRequest(`/favorites?userId=${user.id}&_expand=product`);
                setFavorites(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();

        // Optional: Listen for updates in case user unfavorites an item on this page
        window.addEventListener("favorites-updated", fetchFavorites);
        return () => window.removeEventListener("favorites-updated", fetchFavorites);
    }, [user]);

    if (!user) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-bold">Sign in to view favorites</h2>
                <p className="mb-6 text-muted-foreground">Save items you love to your account.</p>
                <Link href="/login"><Button>Log In</Button></Link>
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">My Favorites ({favorites.length})</h1>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    {favorites.map((item) => (
                        // Note: 'item.product' contains the actual product details due to _expand
                        <ProductCard key={item.id} product={item.product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-6">
                        <Heart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold">No favorites yet</h2>
                    <p className="mb-6 text-muted-foreground">Start browsing and save items you love!</p>
                    <Link href="/shop">
                        <Button>Browse Shop</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}