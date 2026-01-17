import { prisma } from "@/lib/db";

async function main() {
    // 1. Find the Active Campaign (or create one if missing)
    let campaign = await prisma.campaign.findFirst({
        where: { isActive: true }
    });

    if (!campaign) {
        console.log("⚠️ No active campaign found. Creating one...");
        const now = new Date();
        const tomorrow = new Date(); tomorrow.setDate(now.getDate() + 1);

        campaign = await prisma.campaign.create({
            data: {
                name: "Emergency Flash Sale",
                discount: 40, // 40% OFF
                isActive: true,
                startDate: now,
                endDate: tomorrow,
            }
        });
    }

    // 2. Link ALL products to this campaign
    console.log(`🔗 Linking products to campaign: ${campaign.name}`);

    await prisma.product.updateMany({
        data: {
            campaignId: campaign.id
        }
    });

    console.log("✅ SUCCESS: All products are now on Flash Sale!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());