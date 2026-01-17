
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

interface FavoriteContextType {
    favoriteIds: number[]; // Just a list of IDs: [1, 5, 22]
    isFavorite: (productId: number) => boolean;
    toggleFavorite: (productId: number) => Promise<void>;
    isLoading: boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch ALL IDs on load (One request)
    useEffect(() => {
        if (!user) {
            setFavoriteIds([]);
            setIsLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            try {
                // This hits the GET endpoint which now returns simple IDs like [1, 2, 3]
                const ids = await apiRequest(`/favorites?userId=${user.id}`);
                setFavoriteIds(ids);
            } catch (e) {
                console.error("Failed to load favorites");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    // 2. Check function (Instant)
    const isFavorite = (productId: number) => favoriteIds.includes(productId);

    // 3. Toggle Action (Optimistic)
    const toggleFavorite = async (productId: number) => {
        if (!user) {
            toast.info("Please login to save favorites");
            return;
        }

        // A. Instant UI Update (Optimistic)
        const wasFavorite = isFavorite(productId);
        setFavoriteIds((prev) =>
            wasFavorite
                ? prev.filter((id) => id !== productId) // Remove locally
                : [...prev, productId] // Add locally
        );

        // B. Server Sync
        try {
            const res = await apiRequest("/favorites", {
                method: "POST", // The API now handles toggle
                body: JSON.stringify({ userId: user.id, productId }),
            });

            toast.success(res.action === "added" ? "Saved to favorites" : "Removed from favorites");
        } catch (error) {
            // Revert if error
            toast.error("Failed to update favorite");
            setFavoriteIds((prev) =>
                wasFavorite
                    ? [...prev, productId]
                    : prev.filter((id) => id !== productId)
            );
        }
    };

    return (
        <FavoriteContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite, isLoading }}>
            {children}
        </FavoriteContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) throw new Error("useFavorites must be used within FavoriteProvider");
    return context;
};