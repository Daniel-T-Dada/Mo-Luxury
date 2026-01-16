

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFeaturedProducts() {
    try {
        // "no-store" ensures we get fresh data every time (good for selling fast-moving items)
        const res = await fetch(`${BACKEND_URL}/products?_limit=4`, {
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    } catch (e) {
        console.error("Product service error:", e);
        return []; // Return empty array gracefully so the page doesn't crash
    }
}

export async function getProducts(filters: Record<string, string> = {}) {
    try {
        // 1. Build Query String (e.g., ?gender=male&category=shoes)
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });

        // 2. Fetch
        const res = await fetch(`${BACKEND_URL}/products?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

// ... existing imports and functions

export async function getProductById(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch product", error);
        return null;
    }
}