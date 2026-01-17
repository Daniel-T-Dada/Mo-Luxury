// import { PrismaClient, Prisma } from "./generated/prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg'
// import 'dotenv/config'
// const adapter = new PrismaPg({
//     connectionString: process.env.DATABASE_URL,
// })

// const prisma = new PrismaClient({
//     adapter,
// });

import { prisma } from "@/lib/db";


const slidesData = [
    {
        image: "https://images.unsplash.com/photo-1664151099464-8b5fc8fb662d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "The Heritage\nCollection",
        subtitle: "Authentic African prints for the modern era.",
        cta: "Explore Heritage",
        link: "/shop?category=Dress"
    },
    {
        image: "https://images.unsplash.com/photo-1558642842-d30b4b0e4448?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Bold & Beautiful",
        subtitle: "Stand out with vibrant Ankara patterns.",
        cta: "Shop Ankara",
        link: "/shop?category=Dress"
    },
    {
        image: "https://images.unsplash.com/photo-1703883635837-932563331641?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Modern Royalty",
        subtitle: "Elegance redefined for special occasions.",
        cta: "View Gowns",
        link: "/shop?category=Dress"
    },
    {
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071",
        title: "The Gentlemen's\nClub",
        subtitle: "Sharp suits and traditional kaftans.",
        cta: "Shop Men",
        link: "/shop?gender=male"
    },
    {
        image: "https://i.pinimg.com/1200x/50/9a/64/509a640efc6b40bebb066faeb1fb6a4a.jpg",
        title: "Urban African\nStreetwear",
        subtitle: "Where culture meets contemporary style.",
        cta: "Shop Casual",
        link: "/shop?category=Hoodie"
    },
    {
        image: "https://images.unsplash.com/photo-1571346746462-d4e51c41072f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Rich Textures,\nDeep Roots",
        subtitle: "Fabric that tells a story.",
        cta: "Discover More",
        link: "/shop"
    },
    {
        image: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?q=80&w=1974",
        title: "Golden Hour\nGlamour",
        subtitle: "Shine bright in our exclusive evening wear.",
        cta: "Shop Luxury",
        link: "/shop"
    },
    {
        image: "https://images.unsplash.com/photo-1581704868872-df4bc62759ad?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Cultural\nConfidence",
        subtitle: "Wear your heritage with pride.",
        cta: "Shop Now",
        link: "/shop?gender=kids"
    },
    {
        image: "https://images.unsplash.com/photo-1664151099736-1ac6365a25aa?q=80&w=1170",
        title: "Effortless\nBubu Vibes",
        subtitle: "Comfort meets class in every stitch.",
        cta: "View Bubus",
        link: "/shop?category=Dress"
    },
    {
        image: "https://images.unsplash.com/photo-1737649507334-92c9fa4beb7c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Vibrant\nTraditions",
        subtitle: "Celebrating colors that pop.",
        cta: "Shop Accessories",
        link: "/shop?category=Accessories"
    }
];

async function main() {
    console.log("🌱 Seeding Hero Slides...");

    // Clear existing slides to avoid duplicates
    await prisma.heroSlide.deleteMany();

    await prisma.heroSlide.createMany({
        data: slidesData
    });

    console.log("✅ 10 African Themed Slides added!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });