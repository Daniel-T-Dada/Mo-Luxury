"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/api";

export function useFavoritesCount() {
    const { user } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setCount(0);
            return;
        }

        const fetchCount = async () => {
            try {
                const res = await apiRequest(`/favorites?userId=${user.id}`);
                setCount(res.length);
            } catch (e) {
                console.error(e);
            }
        };

        fetchCount();

        // Listen for updates
        window.addEventListener("favorites-updated", fetchCount);
        return () => window.removeEventListener("favorites-updated", fetchCount);
    }, [user]);

    return count;
}