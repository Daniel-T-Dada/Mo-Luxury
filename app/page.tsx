import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { Trending } from "@/components/home/Trending";
import { getFeaturedProducts } from "@/lib/services/products";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"


export default async function HomePage() {
  const [products, slides] = await Promise.all([
    getFeaturedProducts(),
    prisma.heroSlide.findMany() // Fetch slides from DB
  ]);

  // 2. UI: Render Components
  return (
    <div className="flex flex-col gap-6">
      <Hero slides={slides} />
      <Categories />
      <Trending products={products} />
    </div>
  );
}