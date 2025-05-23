
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  change?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  change,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              "mt-1 text-xs",
              change.positive ? "text-green-500" : "text-red-500"
            )}
          >
            {change.positive ? "+" : "-"}
            {change.value} from last month
          </p>
        )}
        {description && (
          <p className="mt-3 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
