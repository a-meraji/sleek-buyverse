import { cn } from "@/lib/utils";

interface FormSectionProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormSection({ title, className, children }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      {children}
    </div>
  );
}