"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"
// (Optional) Import Toast if you installed it: import { useToast } from "@/components/ui/use-toast"

// 1. Define the Validation Schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    role: z.enum(["buyer", "seller", "admin"] as const, {
        message: "Please select a role.",
    }),
});

const SignUpForm = () => {
    const { register } = useAuth(); // Our custom hook
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    // 2. Initialize Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "buyer", // Default to buyer
        },
    });

    // 3. Handle Submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await register(values);

            // Show success toast
            toast.success(`Account created. Welcome ${values.name}!`);

            // Redirect logic based on role
            if (values.role === "seller") {
                router.push("/seller/dashboard");
            } else if (values.role === "admin") {
                router.push("/admin/users");
            } else {
                router.push("/"); // Buyers go to shop
            }

        } catch (err: any) {
            const message = err?.message || "Failed to sign up. Email might be in use.";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <Card className="w-100">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create an account to start shopping or selling.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        {/* Role Select Field */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>I want to be a...</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="buyer">Buyer (I want to shop)</SelectItem>
                                            <SelectItem value="seller">Seller (I want to sell)</SelectItem>
                                            <SelectItem value="admin">Admin (App Owner)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Error Message Display */}
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default SignUpForm;