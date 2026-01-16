import  SignUpForm  from "@/components/auth/SignUpForm"
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <SignUpForm />

            <div className="mt-4 text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-blue-600 hover:underline">
                    Log in here
                </Link>
            </div>
        </div>
    );
}