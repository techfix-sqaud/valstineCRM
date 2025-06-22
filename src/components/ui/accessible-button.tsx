
import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface AccessibleButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ loading, loadingText, ariaLabel, children, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading}
        className={cn(
          "focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          "transition-all duration-200",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            {loadingText || "Loading..."}
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";
