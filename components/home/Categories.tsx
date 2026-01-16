import Link from "next/link";

const CATEGORIES = [
    { label: "Men", value: "male" },
    { label: "Women", value: "female" },
    { label: "Kids", value: "kids" },
    { label: "Unisex", value: "unisex" },
];

export function Categories() {
    return (
        <section className="container mx-auto px-4">
            <h2 className="mb-3 text-lg font-bold text-foreground">Categories</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat.value}
                        href={`/shop?gender=${cat.value}`}
                        className="flex-none"
                    >
                        
                        <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-secondary text-sm font-medium text-secondary-foreground transition hover:bg-muted active:scale-95">
                            {cat.label}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}