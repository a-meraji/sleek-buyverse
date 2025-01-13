import { Badge } from "@/components/ui/badge";

interface SessionBadgeProps {
  count: number;
}

export const SessionBadge = ({ count }: SessionBadgeProps) => {
  if (count <= 0) return null;
  
  return (
    <Badge 
      variant="default"
      className="h-5 w-5 flex items-center justify-center rounded-full p-0 bg-[#0EA5E9] text-[0.7rem] font-light text-white"
    >
      {count}
    </Badge>
  );
};