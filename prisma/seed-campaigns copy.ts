import { prisma } from "@/lib/db";

async function main() {
    console.log("🌱 Seeding Campaigns & Updating Products...");

    // 1. Create a Flash Sale Campaign
    // It starts yesterday and ends tomorrow (so it's ACTIVE right now)
    const now = new Date();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);

    const flashSale = await prisma.campaign.create({
        data: {
            name: "Weekend Flash Sale",
            startDate: yesterday,
            endDate: tomorrow,
            discount: 30, // 30% OFF
            isActive: true,
        }
    });

    console.log(`✅ Created Campaign: ${flashSale.name}`);

    // 2. Update Products with Professional Data
    const products = await prisma.product.findMany();

    for (const product of products) {
        const isKid = Math.random() > 0.8; // 20% chance to be a kid's item
        const isSale = Math.random() > 0.7; // 30% chance to be in the Flash Sale

        await prisma.product.update({
            where: { id: product.id },
            data: {
                // A. Assign Age Group
                ageGroup: isKid ? "kids" : "adult",

                // B. Assign Sizes based on Age
                sizes: isKid
                    ? ["4Y", "6Y", "8Y", "10Y"]
                    : ["S", "M", "L", "XL", "XXL"],

                // C. Assign Colors
                colors: ["Black", "Navy", "White", "Red"].sort(() => 0.5 - Math.random()).slice(0, 3),

                // D. Link to Campaign (If lucky)
                campaignId: isSale ? flashSale.id : null,
            }
        });
    }

    console.log("✅ All products updated with Sizes, Colors, Age Groups & Campaign links!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());