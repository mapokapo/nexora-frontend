import NexoraLogoSvg from "@/assets/images/nexora_logo.svg?react";
import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router";

const NexoraLogo = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  return (
    <Link
      to="/"
      replace
      className={cn(
        "flex w-min items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
        className
      )}
      ref={ref}
      {...props}>
      <div className="h-8 w-8">
        <NexoraLogoSvg className="h-full w-full" />
      </div>
      <span className="text-lg font-bold text-foreground">Nexora</span>
    </Link>
  );
});
NexoraLogo.displayName = "NexoraLogo";

export default NexoraLogo;
