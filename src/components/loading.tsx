import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React from "react";

const Loading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center", className)}
      {...props}>
      <Loader size="2rem" />
    </div>
  );
});
Loading.displayName = "Loading";

export { Loading };
