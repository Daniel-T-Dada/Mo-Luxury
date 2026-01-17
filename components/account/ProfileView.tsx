

import Link from "next/link";
import { Package, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface ProfileViewProps {
    user: any;
    logout: () => void;
}

const ProfileView =({ user, logout }: ProfileViewProps) =>{
    // Logic: Determine Dashboard access
    const isPrivileged = user.role === "admin" || user.role === "seller";

    // Logic: Determine where the link goes
    const dashboardLink = user.role === "admin" ? "/admin/dashboard" : "/seller/dashboard";

    // Logic: Dashboard Label
    const dashboardLabel = user.role === "admin" ? "Admin Dashboard" : "Seller Dashboard";

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs font-medium capitalize text-primary mt-1">{user.role} Account</p>
                </div>
                <ThemeToggle  />
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">My Account</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">

                        {/* 1. Orders Link (Everyone sees this) */}
                        <Link href="/orders" className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">My Orders</span>
                            </div>
                        </Link>

                        {/* 2. Dashboard Link (Only Admin or Seller) */}
                        {isPrivileged && (
                            <Link href={dashboardLink} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    {user.role === "admin" ? (
                                        <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <Settings className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <span className="font-medium">{dashboardLabel}</span>
                                </div>
                            </Link>
                        )}

                    </CardContent>
                </Card>

                <Button variant="destructive" className="mt-4 w-full" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
export {ProfileView};