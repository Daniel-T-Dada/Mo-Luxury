

"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favourites";


interface FavoriteButtonProps {
    productId: number;
    className?: string;
}

export function FavoriteButton({ productId, className }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite, isLoading } = useFavorites(productId);

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full hover:bg-muted", className)}
            onClick={toggleFavorite}
            disabled={isLoading}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-all",
                    isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
                )}
            />
            <span className="sr-only">Toggle Favorite</span>
        </Button>
    );
}