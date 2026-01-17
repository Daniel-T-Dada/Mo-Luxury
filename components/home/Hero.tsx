// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export function Hero() {
//     return (
        
//         <section className="relative h-[300px] w-full overflow-hidden bg-primary text-primary-foreground">
            
//             <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-50" />

//             <div className="relative container mx-auto flex h-full flex-col justify-center px-4">
//                 <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
//                     Fresh Fits <br /> For Everyone.
//                 </h1>
                
//                 <p className="mt-2 text-primary-foreground/90">Male & Female. Young & Old.</p>
//                 <div className="mt-6">
//                     <Link href="/shop">
                        
//                         <Button variant="secondary" className="font-semibold">
//                             Shop Now <ArrowRight className="ml-2 h-4 w-4" />
//                         </Button>
//                     </Link>
//                 </div>
//             </div>
//         </section>
//     );
// }


"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
    slides: {
        id: number;
        image: string;
        title: string;
        subtitle: string;
        cta: string;
        link: string;
    }[];
}

// 1. Define your slides here. Easy to add more!
const SLIDES = [
    {
        id: 1,
        // Fashion/Model shot
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "Fresh Fits\nFor Everyone.",
        subtitle: "Male & Female. Young & Old.",
        cta: "Shop Now",
        link: "/shop",
    },
    {
        id: 2,
        // Streetwear shot
        image: "https://images.unsplash.com/photo-1523396870717-816a21028c15?q=80&w=2070&auto=format&fit=crop",
        title: "Urban Street\nCollection",
        subtitle: "Redefine your everyday style.",
        cta: "View Hoodies",
        link: "/shop?category=Hoodie",
    },
    {
        id: 3,
        // Elegant/Suits shot
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
        title: "Professional\nElegance",
        subtitle: "Suits & Blazers for the modern office.",
        cta: "Shop Formal",
        link: "/shop?category=Suit",
    },
];

export function Hero({ slides }: HeroProps) {
    
    if (!slides || slides.length === 0) return null;
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    // Navigation handlers
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-black">

            {/* Viewport (The window showing the slides) */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">

                    {slides.map((slide) => (
                        <div className="relative flex-[0_0_100%] min-w-0 h-full" key={slide.id}>

                            {/* Background Image using Next/Image for performance */}
                            <div className="absolute inset-0">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={slide.id === 1} // Prioritize loading the first image
                                />
                                {/* Gradient Overlay: Makes text readable even on bright images */}
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                            </div>

                            {/* Text Content */}
                            <div className="relative container mx-auto flex h-full flex-col justify-center px-6 md:px-12 text-white">
                                <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl whitespace-pre-line drop-shadow-lg">
                                    {slide.title}
                                </h1>
                                <p className="mt-4 text-lg md:text-xl font-medium text-white/90 max-w-lg drop-shadow-md">
                                    {slide.subtitle}
                                </p>
                                <div className="mt-8">
                                    <Link href={slide.link}>
                                        <Button
                                            size="lg"
                                            className="rounded-full px-8 text-base font-semibold bg-white text-black hover:bg-white/90 transition-transform hover:scale-105"
                                        >
                                            {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>

            {/* Navigation Buttons (Hidden on mobile to encourage swiping) */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 hover:text-white rounded-full hidden md:flex h-12 w-12"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 hover:text-white rounded-full hidden md:flex h-12 w-12"
                onClick={scrollNext}
            >
                <ChevronRight className="h-8 w-8" />
            </Button>

        </section>
    );
}