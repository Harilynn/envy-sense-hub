import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Clock, AlertTriangle, Info, Wrench, Phone, Mail, User, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSensorData, type Alert } from "@/contexts/SensorDataContext";

interface AlertHistoryProps {}

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
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "default";
  }
};

export const AlertHistory = ({}: AlertHistoryProps) => {
  const { getAcknowledgedAlerts, markAlertFixed } = useSensorData();
  const alerts = getAcknowledgedAlerts();
  const acknowledgedAlerts = alerts.filter(alert => alert.isAcknowledged && !alert.isFixed);
  const fixedAlerts = alerts.filter(alert => alert.isFixed);

  const AlertCard = ({ alert, showFixButton = false }: { alert: Alert; showFixButton?: boolean }) => (
    <div
      key={alert.id}
      className={cn(
        "p-4 rounded-lg border transition-all duration-300",
        alert.type === "danger" && "border-red-200 bg-red-50",
        alert.type === "warning" && "border-yellow-200 bg-yellow-50",
        alert.type === "info" && "border-blue-200 bg-blue-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm">{alert.title}</h4>
            <Badge variant={getAlertBadge(alert.type) as any}>
              {alert.type.toUpperCase()}
            </Badge>
              {alert.isFixed && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Fixed
                </Badge>
              )}
              {alert.isAcknowledged && !alert.isFixed && (
                <Badge variant="secondary" className="bg-info/10 text-info">
                  <Clock className="h-3 w-3 mr-1" />
                  Acknowledged
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {alert.message}
            </p>
            
            {/* Enhanced Suggestions Section */}
            {alert.suggestions && alert.suggestions.length > 0 && (
              <Accordion type="single" collapsible className="border rounded-lg">
                <AccordionItem value="suggestions" className="border-none">
                  <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      <span className="font-medium">Troubleshooting Guide</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="text-sm space-y-2">
                        <h5 className="font-medium text-warning">Recommended Actions:</h5>
                        <ul className="space-y-1 pl-4">
                          {alert.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-xs text-muted-foreground list-disc">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {alert.contactInfo && (
                        <div className="p-3 bg-info/10 rounded-lg border border-info/20">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-info" />
                            <span className="text-sm font-medium text-info">Need Help?</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{alert.contactInfo}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-xs text-info">
                              <Phone className="h-3 w-3" />
                              <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-info">
                              <Mail className="h-3 w-3" />
                              <span>support@smartmonitor.com</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{new Date(alert.timestamp).toLocaleString()}</span>
              {alert.sensor && <span>Sensor: {alert.sensor}</span>}
              {alert.value && alert.threshold && (
                <span>Value: {alert.value} (Threshold: {alert.threshold})</span>
              )}
            </div>
          </div>
        </div>
        {showFixButton && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAlertFixed(alert.id)}
            className="h-8 px-3 hover:bg-success hover:text-success-foreground hover:border-success"
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