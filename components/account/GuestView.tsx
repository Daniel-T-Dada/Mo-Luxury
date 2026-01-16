import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

const GuestView =() => {
    return (
        <div className="flex h-[70vh] flex-col items-center justify-center px-4">
            <div className="mb-6 rounded-full bg-muted p-6">
                <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Profile</h1>
            <p className="mb-8 text-center text-muted-foreground">
                Log in to view your orders and manage your account.
            </p>
            <div className="flex w-full max-w-xs flex-col gap-3">
                {/* Updated links to match our established routes */}
                <Link href="/signin" className="w-full">
                    <Button className="w-full">Log In</Button>
                </Link>
                <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Create Account</Button>
                </Link>
            </div>
        </div>
    );
}
export {GuestView};