import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, AlertTriangle, Info, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  timestamp: Date;
  sensor?: string;
  acknowledged?: boolean;
  fixed?: boolean;
  suggestion?: string;
}

interface AlertHistoryProps {
  acknowledgedAlerts: Alert[];
  fixedAlerts: Alert[];
  onMarkFixed: (alertId: string) => void;
}

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "danger":
      return <AlertTriangle className="h-4 w-4" />;
    case "warning":
      return <Clock className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
  }
};

const getAlertBadge = (type: Alert["type"]) => {
  switch (type) {
    case "danger":
      return "bg-danger text-danger-foreground";
    case "warning":
      return "bg-warning text-warning-foreground";
    case "info":
      return "bg-primary text-primary-foreground";
  }
};

export const AlertHistory = ({ acknowledgedAlerts, fixedAlerts, onMarkFixed }: AlertHistoryProps) => {
  const AlertCard = ({ alert, showFixButton = false }: { alert: Alert; showFixButton?: boolean }) => (
    <div
      key={alert.id}
      className={cn(
        "p-4 rounded-lg border transition-all duration-300",
        alert.type === "danger" && "border-danger/20 bg-danger/5",
        alert.type === "warning" && "border-warning/20 bg-warning/5",
        alert.type === "info" && "border-primary/20 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm">{alert.title}</h4>
              <Badge className={getAlertBadge(alert.type)}>
                {alert.type.toUpperCase()}
              </Badge>
              {alert.fixed && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Fixed
                </Badge>
              )}
              {alert.acknowledged && !alert.fixed && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Acknowledged
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {alert.message}
            </p>
            {alert.suggestion && (
              <div className="p-3 bg-muted/50 rounded border-l-4 border-primary">
                <p className="text-sm">
                  <span className="font-medium text-primary">Suggestion: </span>
                  {alert.suggestion}
                </p>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{alert.timestamp.toLocaleString()}</span>
              {alert.sensor && <span>Sensor: {alert.sensor}</span>}
            </div>
          </div>
        </div>
        {showFixButton && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onMarkFixed(alert.id)}
            className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Wrench className="h-3 w-3 mr-1" />
            Mark Fixed
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Alert History</h2>
        <p className="text-muted-foreground">Track and manage your system alerts</p>
      </div>

      <Tabs defaultValue="acknowledged" className="space-y-4">
        <TabsList>
          <TabsTrigger value="acknowledged" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Acknowledged ({acknowledgedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="fixed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Fixed ({fixedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="acknowledged">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Acknowledged Alerts ({acknowledgedAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {acknowledgedAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No acknowledged alerts</p>
                  <p className="text-sm">Alerts you acknowledge will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acknowledgedAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} showFixButton={true} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Fixed Alerts ({fixedAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fixedAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fixed alerts</p>
                  <p className="text-sm">Alerts marked as fixed will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fixedAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};