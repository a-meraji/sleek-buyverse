import { FC } from "react";

export const LoadingState: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>
  );
};