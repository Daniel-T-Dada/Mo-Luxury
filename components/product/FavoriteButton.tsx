"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/context/favorite-context"; // 👈 Use the new Context Hook

interface FavoriteButtonProps {
    productId: number;
    className?: string;
}

export function FavoriteButton({ productId, className }: FavoriteButtonProps) {
    // Use the global context instead of local fetch
    const { isFavorite, toggleFavorite } = useFavorites();
    const isLiked = isFavorite(productId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full transition-all hover:scale-110",
                isLiked ? "text-destructive hover:text-destructive/80" : "text-muted-foreground hover:text-foreground",
                className
            )}
            onClick={handleClick}
        >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span className="sr-only">Toggle Favorite</span>
        </Button>
    );
}