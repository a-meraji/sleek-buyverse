import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPreviewCard } from "./BlogPreviewCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BlogCarousel() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blog-previews'],
    queryFn: async () => {
      console.log('Fetching blog previews');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }

      console.log('Fetched blog posts:', data);
      return data;
    },
  });

  if (isLoading || !blogs?.length) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {blogs.map((blog) => (
              <CarouselItem 
                key={blog.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <BlogPreviewCard
                  id={blog.id}
                  title={blog.title}
                  summary={blog.summary}
                  mainImageUrl={blog.main_image_url}
                  createdAt={blog.created_at}
                  slug={blog.slug}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}