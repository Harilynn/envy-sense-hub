import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Settings, Clock } from "lucide-react";

interface MetricData {
  label: string;
  value: number;
  max: number;
  status: "good" | "warning" | "danger";
  unit?: string;
}

interface PerformanceMetricsProps {
  machineHealth: number;
  uptime: number;
  efficiency: number;
  maintenanceScore: number;
  nextMaintenance: string;
}

export const PerformanceMetrics = ({
  machineHealth,
  uptime,
  efficiency,
  maintenanceScore,
  nextMaintenance
}: PerformanceMetricsProps) => {
  const getHealthStatus = (value: number): "good" | "warning" | "danger" => {
    if (value >= 85) return "good";
    if (value >= 70) return "warning";
    return "danger";
  };

  const getHealthColor = (status: "good" | "warning" | "danger") => {
    switch (status) {
      case "good": return "text-success";
      case "warning": return "text-warning";
      case "danger": return "text-danger";
    }
  };

  const metrics: MetricData[] = [
    {
      label: "Machine Health",
      value: machineHealth,
      max: 100,
      status: getHealthStatus(machineHealth),
      unit: "%"
    },
    {
      label: "Uptime",
      value: uptime,
      max: 100,
      status: getHealthStatus(uptime),
      unit: "%"
    },
    {
      label: "Efficiency",
      value: efficiency,
      max: 100,
      status: getHealthStatus(efficiency),
      unit: "%"
    },
    {
      label: "Maintenance Score",
      value: maintenanceScore,
      max: 100,
      status: getHealthStatus(maintenanceScore),
      unit: "%"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Machine Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className={`text-sm font-bold ${getHealthColor(metric.status)}`}>
                  {metric.value.toFixed(1)}{metric.unit}
                </span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Maintenance Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <Badge className={
              maintenanceScore >= 85 ? "bg-success text-success-foreground" :
              maintenanceScore >= 70 ? "bg-warning text-warning-foreground" :
              "bg-danger text-danger-foreground"
            }>
              {maintenanceScore >= 85 ? "EXCELLENT" :
               maintenanceScore >= 70 ? "GOOD" : "NEEDS ATTENTION"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Next Maintenance</span>
            </div>
            <p className="text-lg font-semibold text-primary">{nextMaintenance}</p>
          </div>

          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {maintenanceScore < 70 && (
                <li>• Schedule immediate inspection</li>
              )}
              {efficiency < 80 && (
                <li>• Check calibration settings</li>
              )}
              {uptime < 90 && (
                <li>• Review power supply stability</li>
              )}
              {maintenanceScore >= 85 && efficiency >= 80 && uptime >= 90 && (
                <li>• All systems operating optimally</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};