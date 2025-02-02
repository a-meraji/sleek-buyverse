import { Product } from "@/types";
import { CarouselHeader } from "./CarouselHeader";

interface CarouselSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CarouselSection({ title, children }: CarouselSectionProps) {
  return (
    <section>
      <CarouselHeader title={title} />
      {children}
    </section>
  );
}