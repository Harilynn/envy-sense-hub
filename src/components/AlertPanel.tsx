import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { Alert } from "@/contexts/SensorDataContext";

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "danger":
      return <AlertTriangle className="h-4 w-4" />;
    case "warning":
      return <Bell className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
  }
};

const getAlertBadge = (type: Alert["type"]) => {
  switch (type) {
    case "danger":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "default";
  }
};

export const AlertPanel = ({ alerts, onAcknowledge, onDismiss }: AlertPanelProps) => {
  const activeAlerts = alerts.filter(alert => !alert.isAcknowledged);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Active Alerts ({activeAlerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-300 animate-fade-in",
                  alert.type === "danger" && "border-red-200 bg-red-50",
                  alert.type === "warning" && "border-yellow-200 bg-yellow-50",
                  alert.type === "info" && "border-blue-200 bg-blue-50"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge variant={getAlertBadge(alert.type) as any}>
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        {alert.sensor && <span>Sensor: {alert.sensor}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAcknowledge(alert.id)}
                      className="h-8 px-2"
                    >
                      Ack
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismiss(alert.id)}
                      className="h-8 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};