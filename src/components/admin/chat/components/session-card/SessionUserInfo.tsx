import { CardTitle, CardDescription } from "@/components/ui/card";

interface SessionUserInfoProps {
  displayName: string;
  email: string | null;
}

export const SessionUserInfo = ({ displayName, email }: SessionUserInfoProps) => {
  return (
    <div className="space-y-1">
      <CardTitle className="text-sm font-medium">
        {displayName}
      </CardTitle>
      {email && (
        <CardDescription className="text-xs text-muted-foreground">
          {email}
        </CardDescription>
      )}
    </div>
  );
};