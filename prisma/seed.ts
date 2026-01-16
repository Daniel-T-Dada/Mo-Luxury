import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

let prisma: any;


async function main() {
    const dbModule = await import("../lib/db");
    prisma = dbModule.prisma;
    const dbPath = path.join(process.cwd(), "db.json");

    if (!fs.existsSync(dbPath)) {
        console.error("❌ db.json not found at:", dbPath);
        process.exit(1);
    }

    const data = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(data);

    console.log("🌱 Starting migration...");

    // Maps to link Old IDs to New IDs
    const userMap = new Map<number, number>();
    const productMap = new Map<number, number>();

    // --- 1. USERS ---
    if (db.users) {
        console.log(`Processing ${db.users.length} users...`);
        for (const user of db.users) {
            const newUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                },
            });
            userMap.set(user.id, newUser.id);
        }
    }

    // --- 2. PRODUCTS ---
    if (db.products) {
        console.log(`Processing ${db.products.length} products...`);
        for (const product of db.products) {
            const newSellerId = userMap.get(product.sellerId);
            if (!newSellerId) continue;

            const newProduct = await prisma.product.create({
                data: {
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    gender: product.gender,
                    image: product.image,
                    sellerId: newSellerId,
                },
            });
            productMap.set(product.id, newProduct.id);
        }
    }

    // --- 3. ORDERS (Fixed Shipping) ---
    if (db.orders) {
        console.log(`Processing ${db.orders.length} orders...`);
        for (const order of db.orders) {
            const newUserId = userMap.get(order.userId);
            if (!newUserId) continue;

            const orderItemsData = [];
            for (const item of order.items) {
                const newProductId = productMap.get(item.productId);
                if (newProductId) {
                    orderItemsData.push({
                        productId: newProductId,
                        quantity: item.quantity,
                    });
                }
            }

            if (orderItemsData.length > 0) {
                await prisma.order.create({
                    data: {
                        userId: newUserId,
                        total: order.total,
                        status: order.status,
                        date: new Date(order.date),
                        // 👇 THIS IS THE FIX:
                        shipping: order.shipping ? JSON.stringify(order.shipping) : null,
                        items: {
                            create: orderItemsData,
                        },
                    },
                });
            }
        }
    }

    // --- 4. FAVORITES ---
    if (db.favorites) {
        console.log(`Processing ${db.favorites.length} favorites...`);
        for (const fav of db.favorites) {
            const newUserId = userMap.get(fav.userId);
            const newProductId = productMap.get(fav.productId);

            if (newUserId && newProductId) {
                await prisma.favorite.create({
                    data: {
                        userId: newUserId,
                        productId: newProductId
                    }
                });
            }
        }
    }

    console.log("✅ Migration completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });