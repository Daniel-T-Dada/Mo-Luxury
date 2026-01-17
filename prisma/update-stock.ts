
import { prisma } from "@/lib/db";

async function main() {
    console.log("🔄 Updating inventory counts...");

    const products = await prisma.product.findMany();

    for (const product of products) {
        // Generate random realistic numbers
        const randomStock = Math.floor(Math.random() * 20) + 1; // 1 to 20 left
        const randomSold = Math.floor(Math.random() * 50) + 5;  // 5 to 55 sold

        await prisma.product.update({
            where: { id: product.id },
            data: {
                stock: randomStock,
                sold: randomSold,
            },
        });
    }

    console.log("✅ All products now have real stock & sales data!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());