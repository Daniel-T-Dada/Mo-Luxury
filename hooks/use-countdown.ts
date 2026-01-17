// hooks/use-countdown.ts
"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

export function useCountdown(initialHours: number = 12) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        hours: initialHours,
        minutes: 45,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev; // Time's up
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return timeLeft;
}