"use client";

import { GuestView } from "@/components/account/GuestView";
import { ProfileView } from "@/components/account/ProfileView";
import { useAuth } from "@/context/auth-context";


export default function AccountPage() {
    const { user, logout } = useAuth();

    if (!user) {
        return <GuestView />;
    }

    return <ProfileView user={user} logout={logout} />;
}