"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mergeLocalCart } from "@/lib/cart-merge";

interface User {
    id: number;
    email: string;
    name: string;
    role: "admin" | "seller" | "buyer";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 1. Check Session on App Load
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Session check failed", err);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Login Function
    const login = async (email: string, pass: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password: pass }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        await mergeLocalCart(data.user.id);
        setUser(data.user);
        router.refresh();
        // Note: No localStorage here. The Cookie is set by the server automatically.
    };

    // 3. Register Function (FIXED)
    const register = async (formData: any) => {
        // We now call our own Next.js API, just like login
        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }

        const data = await res.json();
        await mergeLocalCart(data.user.id);

        // Registration automatically logs us in, so update state
        setUser(data.user);
        router.refresh();
    };

    // 4. Logout Function
    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/signin"); // Updated to match your route name if it's 'login' or 'signin'
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};