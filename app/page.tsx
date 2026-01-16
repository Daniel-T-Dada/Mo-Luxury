import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { Trending } from "@/components/home/Trending";
import { getFeaturedProducts } from "@/lib/services/products";


export default async function HomePage() {
  // 1. Logic: Fetch Data on Server
  const products = await getFeaturedProducts();

  // 2. UI: Render Components
  return (
    <div className="flex flex-col gap-6">
      <Hero />
      <Categories />
      <Trending products={products} />
    </div>
  );
}