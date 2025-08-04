import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SensorCard } from "@/components/SensorCard";
import { AlertPanel } from "@/components/AlertPanel";
import { SensorChart } from "@/components/SensorChart";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { MachineLearningAnalysis } from "@/components/MachineLearningAnalysis";
import { DataBridge } from "@/components/DataBridge";
import { AlertHistory } from "@/components/AlertHistory";
import { AnalysisReport } from "@/components/AnalysisReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSensorData } from "@/contexts/SensorDataContext";
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Wifi, 
  WifiOff,
  History,
  FileText,
  TrendingUp
} from "lucide-react";

interface SensorData {
  temperature: number;
  humidity: number;
  gasEmission: number;
  vibration: number;
  current: number;
  timestamp: Date;
}

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

const Dashboard = () => {
  const location = useLocation();
  const isDashboardRoot = location.pathname === "/dashboard";

  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 23.5,
    humidity: 45.2,
    gasEmission: 150.0,
    vibration: 12000.0,
    current: 1.8,
    timestamp: new Date()
  });

  const [historicalData, setHistoricalData] = useState({
    temperature: [] as Array<{timestamp: string, value: number}>,
    humidity: [] as Array<{timestamp: string, value: number}>,
    gasEmission: [] as Array<{timestamp: string, value: number}>,
    vibration: [] as Array<{timestamp: string, value: number}>,
    current: [] as Array<{timestamp: string, value: number}>
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "High Gas Emission",
      message: "Gas concentration approaching upper threshold",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      sensor: "Gas Sensor",
      suggestion: "Check ventilation system and ensure proper air circulation. Consider reducing production load temporarily."
    },
    {
      id: "2",
      type: "info",
      title: "System Online",
      message: "All sensors are operational and reporting normally",
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    }
  ]);

  const [isConnected, setIsConnected] = useState(true);

  const getTemperatureStatus = (temp: number): "good" | "warning" | "danger" => {
    if (temp > 60) return "danger";
    if (temp > 45) return "warning";
    return "good";
  };

  const getHumidityStatus = (humidity: number): "good" | "warning" | "danger" => {
    if (humidity > 80 || humidity < 20) return "danger";
    if (humidity > 70 || humidity < 30) return "warning";
    return "good";
  };

  const getGasStatus = (gas: number): "good" | "warning" | "danger" => {
    if (gas > 400) return "danger";
    if (gas > 300) return "warning";
    return "good";
  };

  const getVibrationStatus = (vibration: number): "good" | "warning" | "danger" => {
    if (vibration > 20000) return "danger";
    if (vibration > 15000) return "warning";
    return "good";
  };

  const getCurrentStatus = (current: number): "good" | "warning" | "danger" => {
    if (current > 2.5) return "danger";
    if (current > 2.0) return "warning";
    return "good";
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleFixAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, fixed: true } : alert
    ));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged && !alert.fixed);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged && !alert.fixed);
  const fixedAlerts = alerts.filter(alert => alert.fixed);

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeAlerts={activeAlerts.length} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {isDashboardRoot && (
          <>
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Real-time monitoring and analytics</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
                  {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isConnected ? "ESP32 Connected" : "Disconnected"}
                </Badge>
                <Button 
                  variant="outline" 
                  onClick={() => setIsConnected(!isConnected)}
                >
                  {isConnected ? "Simulate Disconnect" : "Reconnect"}
                </Button>
              </div>
            </div>

            {/* Dashboard Navigation Tabs */}
            <Tabs defaultValue="live" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Live Dashboard
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Alert History
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="live" className="space-y-6">
                {/* Real-time Sensor Data */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <SensorCard
                    title="Temperature"
                    value={sensorData.temperature}
                    unit="°C"
                    status={getTemperatureStatus(sensorData.temperature)}
                    icon={<Thermometer className="h-4 w-4" />}
                    threshold={{ min: 18, max: 60 }}
                    trend={sensorData.temperature > 45 ? "up" : sensorData.temperature < 25 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Humidity"
                    value={sensorData.humidity}
                    unit="%"
                    status={getHumidityStatus(sensorData.humidity)}
                    icon={<Droplets className="h-4 w-4" />}
                    threshold={{ min: 20, max: 80 }}
                    trend={sensorData.humidity > 70 ? "up" : sensorData.humidity < 30 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Gas Emission"
                    value={sensorData.gasEmission}
                    unit="ppm"
                    status={getGasStatus(sensorData.gasEmission)}
                    icon={<AlertTriangle className="h-4 w-4" />}
                    threshold={{ min: 0, max: 400 }}
                    trend={sensorData.gasEmission > 300 ? "up" : sensorData.gasEmission < 150 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Vibration"
                    value={sensorData.vibration}
                    unit=""
                    status={getVibrationStatus(sensorData.vibration)}
                    icon={<Activity className="h-4 w-4" />}
                    threshold={{ min: 0, max: 20000 }}
                    trend={sensorData.vibration > 15000 ? "up" : sensorData.vibration < 10000 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Current"
                    value={sensorData.current}
                    unit="A"
                    status={getCurrentStatus(sensorData.current)}
                    icon={<Zap className="h-4 w-4" />}
                    threshold={{ min: 0, max: 2.5 }}
                    trend={sensorData.current > 2.0 ? "up" : sensorData.current < 1.2 ? "down" : "stable"}
                  />
                </div>

                {/* Charts and Alerts */}
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-4">
                    <SensorChart
                      title="Temperature"
                      data={historicalData.temperature}
                      unit="°C"
                      color="hsl(var(--primary))"
                      threshold={{ max: 60 }}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <SensorChart
                        title="Humidity"
                        data={historicalData.humidity}
                        unit="%"
                        color="hsl(var(--accent))"
                        threshold={{ min: 20, max: 80 }}
                      />
                      <SensorChart
                        title="Gas Emission"
                        data={historicalData.gasEmission}
                        unit="ppm"
                        color="hsl(var(--warning))"
                        threshold={{ max: 400 }}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <SensorChart
                        title="Vibration"
                        data={historicalData.vibration}
                        unit=""
                        color="hsl(280, 100%, 70%)"
                        threshold={{ max: 20000 }}
                      />
                      <SensorChart
                        title="Current"
                        data={historicalData.current}
                        unit="A"
                        color="hsl(190, 100%, 60%)"
                        threshold={{ max: 2.5 }}
                      />
                    </div>
                  </div>
                  <AlertPanel
                    alerts={activeAlerts}
                    onAcknowledge={handleAcknowledgeAlert}
                    onDismiss={handleDismissAlert}
                  />
                </div>

                {/* Performance Metrics */}
                <PerformanceMetrics
                  machineHealth={87.5}
                  uptime={94.2}
                  efficiency={91.8}
                  maintenanceScore={89.3}
                  nextMaintenance="March 15, 2024"
                />

                {/* Data Bridge */}
                <DataBridge onDataReceived={(data) => {
                  setSensorData(prev => ({ ...prev, ...data }));
                  
                  const timeStr = data.timestamp.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });

                  setHistoricalData(prev => ({
                    temperature: [...prev.temperature.slice(-19), { timestamp: timeStr, value: data.temperature }],
                    humidity: [...prev.humidity.slice(-19), { timestamp: timeStr, value: data.humidity }],
                    gasEmission: [...prev.gasEmission.slice(-19), { timestamp: timeStr, value: data.gasEmission }],
                    vibration: [...prev.vibration.slice(-19), { timestamp: timeStr, value: data.vibration }],
                    current: [...prev.current.slice(-19), { timestamp: timeStr, value: data.current }]
                  }));

                  // Generate alerts with suggestions
                  const newAlerts: Alert[] = [];
                  if (data.temperature > 60) {
                    newAlerts.push({
                      id: `temp-${Date.now()}`,
                      type: "danger",
                      title: "Overheat Alert",
                      message: `Temperature exceeded 60°C (Current: ${data.temperature.toFixed(1)}°C)`,
                      timestamp: new Date(),
                      sensor: "Temperature Sensor",
                      suggestion: "Immediately check cooling system. Reduce machine load and ensure proper ventilation. Consider emergency shutdown if temperature continues to rise."
                    });
                  }
                  if (data.current > 2.5) {
                    newAlerts.push({
                      id: `current-${Date.now()}`,
                      type: "danger", 
                      title: "Current Spike Alert",
                      message: `Current exceeded safe threshold (Current: ${data.current.toFixed(1)} A)`,
                      timestamp: new Date(),
                      sensor: "Current Sensor",
                      suggestion: "Check electrical connections and motor load. Inspect for short circuits or mechanical binding. Consider reducing operational speed."
                    });
                  }
                  if (data.vibration > 20000) {
                    newAlerts.push({
                      id: `vibration-${Date.now()}`,
                      type: "danger",
                      title: "High Vibration Alert", 
                      message: `Excessive vibrations detected (Current: ${data.vibration.toFixed(0)})`,
                      timestamp: new Date(),
                      sensor: "Vibration Sensor",
                      suggestion: "Inspect bearings, alignment, and mounting bolts. Check for worn components. Schedule immediate maintenance inspection."
                    });
                  }
                  if (data.gasEmission > 400) {
                    newAlerts.push({
                      id: `gas-${Date.now()}`,
                      type: "danger",
                      title: "High Gas Emission",
                      message: `Gas concentration critical (Current: ${data.gasEmission.toFixed(1)} ppm)`,
                      timestamp: new Date(),
                      sensor: "Gas Sensor",
                      suggestion: "Evacuate area if necessary. Check for leaks in gas lines. Increase ventilation and monitor air quality closely."
                    });
                  }
                  if (data.humidity > 80) {
                    newAlerts.push({
                      id: `humidity-${Date.now()}`,
                      type: "warning",
                      title: "High Humidity",
                      message: `Humidity exceeds normal range (Current: ${data.humidity.toFixed(1)}%)`,
                      timestamp: new Date(),
                      sensor: "Humidity Sensor",
                      suggestion: "Improve air circulation and consider dehumidification. Check for water leaks or steam sources near equipment."
                    });
                  }
                  
                  if (newAlerts.length > 0) {
                    setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
                  }
                }} />

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Device ID</p>
                        <p className="font-mono text-sm">ESP32-001</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Update</p>
                        <p className="text-sm">{sensorData.timestamp.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Firmware</p>
                        <p className="text-sm">v2.1.3</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Signal Strength</p>
                        <p className="text-sm">-42 dBm (Excellent)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <AlertHistory />
              </TabsContent>

              <TabsContent value="analysis">
                <MachineLearningAnalysis sensorData={sensorData} historicalData={historicalData} />
              </TabsContent>

              <TabsContent value="reports">
                <AnalysisReport sensorData={sensorData} historicalData={historicalData} alerts={alerts} />
              </TabsContent>
            </Tabs>
          </>
        )}

        <Routes>
          <Route path="/alerts" element={<AlertHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;