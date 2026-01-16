"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// 1. Validation Schema (Simpler than signup)
const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export function SignInForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    // Check if there is a place we need to redirect to (e.g., /checkout)
    const redirectPath = searchParams.get("redirect");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await login(values.email, values.password);

            // --- REDIRECT LOGIC ---
            // 1. If there is a specific redirect (e.g. from Cart), go there.
            if (redirectPath) {
                router.push(redirectPath);
                return;
            }

            // 2. Otherwise, check role (We need to read the role from the stored user)
            // Note: We read from localStorage because state updates might be slightly async
            const userString = localStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;

            if (user?.role === "admin") {
                router.push("/admin/dashboard");
            } else if (user?.role === "seller") {
                router.push("/seller/dashboard");
            } else {
                router.push("/"); // Buyers go to shop
            }

        } catch (err: any) {
            console.error(err);
            setError("Invalid email or password.");
        }
    };

    return (
        <Card className="w-100">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Welcome back! Please login to your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Error Message */}
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
export default SignInForm;