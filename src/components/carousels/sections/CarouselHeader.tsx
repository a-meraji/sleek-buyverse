interface CarouselHeaderProps {
  title: string;
}

export function CarouselHeader({ title }: CarouselHeaderProps) {
  return (
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
  );
}