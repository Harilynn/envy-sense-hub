import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "danger";
  icon: React.ReactNode;
  threshold?: {
    min?: number;
    max?: number;
  };
  trend?: "up" | "down" | "stable";
}

const getStatusVariant = (status: "good" | "warning" | "danger") => {
  switch (status) {
    case "good":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "destructive";
  }
};

const getTrendIcon = (trend?: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return "↗";
    case "down":
      return "↘";
    case "stable":
      return "→";
    default:
      return "";
  }
};

export const SensorCard = ({ 
  title, 
  value, 
  unit, 
  status, 
  icon, 
  threshold,
  trend 
}: SensorCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      status === "danger" && "animate-pulse-glow"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">
            {(value ?? 0).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">
            {unit}
          </div>
          {trend && (
            <div className="text-sm text-muted-foreground">
              {getTrendIcon(trend)}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant={getStatusVariant(status) as any}>
            {status.toUpperCase()}
          </Badge>
          {threshold && (
            <div className="text-xs text-muted-foreground">
              Range: {threshold.min ?? 0}-{threshold.max ?? "∞"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};