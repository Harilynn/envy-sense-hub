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

const getStatusGradient = (status: "good" | "warning" | "danger") => {
  switch (status) {
    case "good":
      return "bg-gradient-to-br from-success/10 via-success/5 to-background";
    case "warning":
      return "bg-gradient-to-br from-warning/10 via-warning/5 to-background";
    case "danger":
      return "bg-gradient-to-br from-destructive/10 via-destructive/5 to-background";
    default:
      return "bg-gradient-card";
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
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105",
      getStatusGradient(status),
      status === "danger" && "animate-pulse-glow",
      status === "warning" && "animate-pulse-glow-yellow",
      "border-0 shadow-tech"
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