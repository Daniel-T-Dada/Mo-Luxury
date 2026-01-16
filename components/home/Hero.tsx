import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        
        <section className="relative h-[300px] w-full overflow-hidden bg-primary text-primary-foreground">
            
            <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-50" />

            <div className="relative container mx-auto flex h-full flex-col justify-center px-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                    Fresh Fits <br /> For Everyone.
                </h1>
                
                <p className="mt-2 text-primary-foreground/90">Male & Female. Young & Old.</p>
                <div className="mt-6">
                    <Link href="/shop">
                        
                        <Button variant="secondary" className="font-semibold">
                            Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}