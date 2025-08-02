import { useState, useEffect } from "react";
import { SensorCard } from "@/components/SensorCard";
import { AlertPanel } from "@/components/AlertPanel";
import { SensorChart } from "@/components/SensorChart";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { MachineLearningAnalysis } from "@/components/MachineLearningAnalysis";
import { DataBridge } from "@/components/DataBridge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Activity, Zap, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SensorData {
  temperature: number;
  humidity: number;
  gasEmission: number; // in ppm
  vibration: number;
  current: number; // in amperes
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
}

const Index = () => {
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
      sensor: "Gas Sensor"
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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: SensorData = {
        temperature: 20 + Math.random() * 40 + Math.sin(Date.now() / 60000) * 8,
        humidity: 40 + Math.random() * 40 + Math.cos(Date.now() / 45000) * 10,
        gasEmission: 100 + Math.random() * 300 + Math.sin(Date.now() / 30000) * 50,
        vibration: 8000 + Math.random() * 15000 + Math.sin(Date.now() / 25000) * 3000,
        current: 1.0 + Math.random() * 2.0 + Math.cos(Date.now() / 35000) * 0.5,
        timestamp: new Date()
      };

      setSensorData(newData);

      // Update historical data (keep last 20 points)
      const timeStr = newData.timestamp.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setHistoricalData(prev => ({
        temperature: [...prev.temperature.slice(-19), { timestamp: timeStr, value: newData.temperature }],
        humidity: [...prev.humidity.slice(-19), { timestamp: timeStr, value: newData.humidity }],
        gasEmission: [...prev.gasEmission.slice(-19), { timestamp: timeStr, value: newData.gasEmission }],
        vibration: [...prev.vibration.slice(-19), { timestamp: timeStr, value: newData.vibration }],
        current: [...prev.current.slice(-19), { timestamp: timeStr, value: newData.current }]
      }));

      // Check for alerts based on ESP32 thresholds
      if (newData.temperature > 60 && !alerts.some(a => a.title.includes("Overheat"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "danger",
          title: "Overheat Alert",
          message: `Temperature exceeded 60°C (Current: ${newData.temperature.toFixed(1)}°C)`,
          timestamp: new Date(),
          sensor: "Temperature Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      if (newData.current > 2.5 && !alerts.some(a => a.title.includes("Current Spike"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "danger",
          title: "Current Spike Alert",
          message: `Current exceeded safe threshold (Current: ${newData.current.toFixed(1)} A)`,
          timestamp: new Date(),
          sensor: "Current Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      if (newData.vibration > 20000 && !alerts.some(a => a.title.includes("Vibration"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "danger",
          title: "High Vibration Alert",
          message: `Excessive vibrations detected (Current: ${newData.vibration.toFixed(0)})`,
          timestamp: new Date(),
          sensor: "Vibration Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      if (newData.gasEmission > 400 && !alerts.some(a => a.title.includes("Gas"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "danger",
          title: "High Gas Emission",
          message: `Gas concentration critical (Current: ${newData.gasEmission.toFixed(1)} ppm)`,
          timestamp: new Date(),
          sensor: "Gas Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      if (newData.humidity > 80 && !alerts.some(a => a.title.includes("Humidity"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "warning",
          title: "High Humidity",
          message: `Humidity exceeds normal range (Current: ${newData.humidity.toFixed(1)}%)`,
          timestamp: new Date(),
          sensor: "Humidity Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [alerts]);

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

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Industrial IoT Monitor</h1>
            <p className="text-muted-foreground">Real-time environmental and performance monitoring with AI analysis</p>
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
                color="hsl(var(--chart-3))"
                threshold={{ max: 20000 }}
              />
              <SensorChart
                title="Current"
                data={historicalData.current}
                unit="A"
                color="hsl(var(--chart-5))"
                threshold={{ max: 2.5 }}
              />
            </div>
          </div>
          <AlertPanel
            alerts={alerts}
            onAcknowledge={handleAcknowledgeAlert}
            onDismiss={handleDismissAlert}
          />
        </div>

        {/* Data Bridge */}
        <DataBridge onDataReceived={(data) => {
          setSensorData(prev => ({ ...prev, ...data }));
        }} />

        {/* AI Analysis */}
        <MachineLearningAnalysis sensorData={sensorData} historicalData={historicalData} />

        {/* Performance Metrics */}
        <PerformanceMetrics
          machineHealth={87.5}
          uptime={94.2}
          efficiency={91.8}
          maintenanceScore={89.3}
          nextMaintenance="March 15, 2024"
        />

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
      </div>
    </div>
  );
};

export default Index;
