

"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function DashboardBackButton() {
    const { user } = useAuth();

    // Logic: Dynamic Destination
    const destination = user?.role === "admin"
        ? "/admin/dashboard"
        : "/seller/dashboard";

    return (
        <Link href={destination}>
            <Button variant="ghost" size="icon" title="Back to Dashboard">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
    );
}