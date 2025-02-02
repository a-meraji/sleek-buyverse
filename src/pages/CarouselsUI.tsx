import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { Navbar } from "@/components/Navbar";
import { 
  BasicCarousel,
  FadeCarousel,
  GridCarousel,
  InfiniteCarousel,
  MinimalCarousel,
  ModernCarousel,
  SnapCarousel,
  ThreeDCarousel,
  VerticalCarousel,
  ZoomCarousel,
  GradientCarousel,
  BorderCarousel,
  ShadowCarousel,
  FloatingCarousel,
  GlassCarousel,
  NeumorphicCarousel,
  OutlineCarousel,
  ColorfulCarousel,
  MinimalistCarousel,
  DarkCarousel,
  CircularCarousel,
  InfiniteScrollCarousel,
  StackedCarousel,
  CubeCarousel,
  ParallaxCarousel,
  CascadeCarousel,
  MasonryCarousel,
  TimelineCarousel,
  PerspectiveCarousel,
  WaterfallCarousel,
  CleanNeomorphicCarousel,
  ParallaxScrollCarousel
} from "@/components/carousels";

export default function CarouselsUI() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['carousel-products'],
    queryFn: async () => {
      console.log('Fetching products for carousels');
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)')
        .limit(10);

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data as Product[];
    },
  });

  if (isLoading || !products) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 space-y-16">
        <h1 className="text-4xl font-bold text-center mb-12">Product Carousel Showcase</h1>
        
        {/* Original Carousels */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Basic Carousel</h2>
          <BasicCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Modern Carousel</h2>
          <ModernCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Minimal Carousel</h2>
          <MinimalCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Grid Carousel</h2>
          <GridCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Infinite Carousel</h2>
          <InfiniteCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Fade Carousel</h2>
          <FadeCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">3D Carousel</h2>
          <ThreeDCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Snap Carousel</h2>
          <SnapCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Vertical Carousel</h2>
          <VerticalCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Zoom Carousel</h2>
          <ZoomCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Gradient Carousel</h2>
          <GradientCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Border Carousel</h2>
          <BorderCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Shadow Carousel</h2>
          <ShadowCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Floating Carousel</h2>
          <FloatingCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Glass Carousel</h2>
          <GlassCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Neumorphic Carousel</h2>
          <NeumorphicCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Outline Carousel</h2>
          <OutlineCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Colorful Carousel</h2>
          <ColorfulCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Minimalist Carousel</h2>
          <MinimalistCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Dark Carousel</h2>
          <DarkCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Parallax Scroll Carousel</h2>
          <ParallaxScrollCarousel products={products} />
        </section>

        {/* Rest of the carousels */}
        {/* New Carousels */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Clean Neumorphic Carousel</h2>
          <CleanNeomorphicCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Circular Carousel</h2>
          <CircularCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Infinite Scroll Carousel</h2>
          <InfiniteScrollCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Stacked Carousel</h2>
          <StackedCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Cube Carousel</h2>
          <CubeCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Parallax Carousel</h2>
          <ParallaxCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Cascade Carousel</h2>
          <CascadeCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Masonry Carousel</h2>
          <MasonryCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Timeline Carousel</h2>
          <TimelineCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Perspective Carousel</h2>
          <PerspectiveCarousel products={products} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Waterfall Carousel</h2>
          <WaterfallCarousel products={products} />
        </section>
      </main>
    </div>
  );
}
