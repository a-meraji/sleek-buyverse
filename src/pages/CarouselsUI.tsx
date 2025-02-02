import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { Navbar } from "@/components/Navbar";
import { CarouselSection } from "@/components/carousels/sections/CarouselSection";
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
  ParallaxScrollCarousel,
  SpecialOffersCarousel
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
        
        <CarouselSection title="Special Offers Carousel">
          <SpecialOffersCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Basic Carousel">
          <BasicCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Modern Carousel">
          <ModernCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Minimal Carousel">
          <MinimalCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Grid Carousel">
          <GridCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Infinite Carousel">
          <InfiniteCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Fade Carousel">
          <FadeCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="3D Carousel">
          <ThreeDCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Snap Carousel">
          <SnapCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Vertical Carousel">
          <VerticalCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Zoom Carousel">
          <ZoomCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Gradient Carousel">
          <GradientCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Border Carousel">
          <BorderCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Shadow Carousel">
          <ShadowCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Floating Carousel">
          <FloatingCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Glass Carousel">
          <GlassCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Neumorphic Carousel">
          <NeumorphicCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Outline Carousel">
          <OutlineCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Colorful Carousel">
          <ColorfulCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Minimalist Carousel">
          <MinimalistCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Dark Carousel">
          <DarkCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Parallax Scroll Carousel">
          <ParallaxScrollCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Clean Neumorphic Carousel">
          <CleanNeomorphicCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Circular Carousel">
          <CircularCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Infinite Scroll Carousel">
          <InfiniteScrollCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Stacked Carousel">
          <StackedCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Cube Carousel">
          <CubeCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Parallax Carousel">
          <ParallaxCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Cascade Carousel">
          <CascadeCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Masonry Carousel">
          <MasonryCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Timeline Carousel">
          <TimelineCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Perspective Carousel">
          <PerspectiveCarousel products={products} />
        </CarouselSection>

        <CarouselSection title="Waterfall Carousel">
          <WaterfallCarousel products={products} />
        </CarouselSection>
      </main>
    </div>
  );
}