

"use client";

import Marquee from "react-fast-marquee";

export function AnnouncementBar() {
    return (
        <div className="bg-primary text-white py-2 text-sm font-medium border-b border-white/10">
            <Marquee gradient={false} speed={40} pauseOnHover>
                <span className="mx-8">🚀 FREE SHIPPING on orders over ₦50,000!</span>
                <span className="mx-8">🔥 FLASH SALE: Up to 50% OFF selected items!</span>
                <span className="mx-8">🌍 We ship fast to Lagos, Abuja & Port Harcourt.</span>
                <span className="mx-8">💳 Secure Payment via Paystack & Flutterwave.</span>
            </Marquee>
        </div>
    );
}