
import Link from "next/link";
import { Suspense } from "react";
import  SignInForm  from "@/components/auth/SignInForm";

// Note: Suspense is needed because we use useSearchParams in the component
const signinPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <Suspense fallback={<div>Loading form...</div>}>
                <SignInForm />
            </Suspense>

            <div className="mt-4 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:underline">
                    Sign up here
                </Link>
            </div>
        </div>
    );
}

export default signinPage;