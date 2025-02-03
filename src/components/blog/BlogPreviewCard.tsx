import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface BlogPreviewCardProps {
  id: string;
  title: string;
  summary?: string | null;
  mainImageUrl: string;
  createdAt: string;
  slug: string;
}

export function BlogPreviewCard({ title, summary, mainImageUrl, createdAt, slug }: BlogPreviewCardProps) {
  return (
    <Link to={`/blog/${slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={mainImageUrl} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          {summary && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {summary}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}