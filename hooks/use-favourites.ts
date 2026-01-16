

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export function useFavorites(productId: number) {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null); // We need the ID to delete it
    const [isLoading, setIsLoading] = useState(false);

    // 1. Check status on load
    useEffect(() => {
        if (!user) return;

        const checkStatus = async () => {
            try {
                // Find if this specific user has favorited this specific product
                const res = await apiRequest(`/favorites?userId=${user.id}&productId=${productId}`);
                if (res.length > 0) {
                    setIsFavorite(true);
                    setFavoriteId(res[0].id);
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkStatus();
    }, [user, productId]);

    // 2. Toggle Handler
    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent clicking parent Link
        e.stopPropagation();

        if (!user) {
            toast.info("Please login to save favorites");
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite && favoriteId) {
                // REMOVE
                await apiRequest(`/favorites/${favoriteId}`, { method: "DELETE" });
                setIsFavorite(false);
                setFavoriteId(null);
                toast.success("Removed from favorites");
                window.dispatchEvent(new Event("favorites-updated"));
            } else {
                // ADD
                const res = await apiRequest("/favorites", {
                    method: "POST",
                    body: JSON.stringify({ userId: user.id, productId }),
                });
                setIsFavorite(true);
                setFavoriteId(res.id);
                toast.success("Saved to favorites");
                window.dispatchEvent(new Event("favorites-updated"));
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return { isFavorite, toggleFavorite, isLoading };
}