import { useState, useEffect } from "react";
import { SensorCard } from "@/components/SensorCard";
import { AlertPanel } from "@/components/AlertPanel";
import { SensorChart } from "@/components/SensorChart";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Wind, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SensorData {
  temperature: number;
  humidity: number;
  dust: number;
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
    dust: 12.8,
    timestamp: new Date()
  });

  const [historicalData, setHistoricalData] = useState({
    temperature: [] as Array<{timestamp: string, value: number}>,
    humidity: [] as Array<{timestamp: string, value: number}>,
    dust: [] as Array<{timestamp: string, value: number}>
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "High Dust Level",
      message: "Dust concentration approaching upper threshold",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      sensor: "Dust Sensor"
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
        temperature: 20 + Math.random() * 10 + Math.sin(Date.now() / 60000) * 3,
        humidity: 40 + Math.random() * 20 + Math.cos(Date.now() / 45000) * 5,
        dust: 8 + Math.random() * 15 + Math.sin(Date.now() / 30000) * 4,
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
        dust: [...prev.dust.slice(-19), { timestamp: timeStr, value: newData.dust }]
      }));

      // Check for alerts
      if (newData.temperature > 30 && !alerts.some(a => a.title.includes("High Temperature"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "danger",
          title: "High Temperature Alert",
          message: `Temperature exceeded 30°C (Current: ${newData.temperature.toFixed(1)}°C)`,
          timestamp: new Date(),
          sensor: "Temperature Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }

      if (newData.dust > 20 && !alerts.some(a => a.title.includes("Critical Dust"))) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: "danger",
          title: "Critical Dust Level",
          message: `Dust concentration critical (Current: ${newData.dust.toFixed(1)} μg/m³)`,
          timestamp: new Date(),
          sensor: "Dust Sensor"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [alerts]);

  const getTemperatureStatus = (temp: number): "good" | "warning" | "danger" => {
    if (temp > 30) return "danger";
    if (temp > 25) return "warning";
    return "good";
  };

  const getHumidityStatus = (humidity: number): "good" | "warning" | "danger" => {
    if (humidity > 70 || humidity < 30) return "danger";
    if (humidity > 60 || humidity < 40) return "warning";
    return "good";
  };

  const getDustStatus = (dust: number): "good" | "warning" | "danger" => {
    if (dust > 20) return "danger";
    if (dust > 15) return "warning";
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
            <p className="text-muted-foreground">Real-time environmental and performance monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? "Connected" : "Disconnected"}
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
        <div className="grid gap-4 md:grid-cols-3">
          <SensorCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            status={getTemperatureStatus(sensorData.temperature)}
            icon={<Thermometer className="h-4 w-4" />}
            threshold={{ min: 18, max: 30 }}
            trend={sensorData.temperature > 25 ? "up" : sensorData.temperature < 20 ? "down" : "stable"}
          />
          <SensorCard
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            status={getHumidityStatus(sensorData.humidity)}
            icon={<Droplets className="h-4 w-4" />}
            threshold={{ min: 30, max: 70 }}
            trend={sensorData.humidity > 60 ? "up" : sensorData.humidity < 40 ? "down" : "stable"}
          />
          <SensorCard
            title="Dust Concentration"
            value={sensorData.dust}
            unit="μg/m³"
            status={getDustStatus(sensorData.dust)}
            icon={<Wind className="h-4 w-4" />}
            threshold={{ min: 0, max: 20 }}
            trend={sensorData.dust > 15 ? "up" : sensorData.dust < 10 ? "down" : "stable"}
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
              threshold={{ max: 30 }}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <SensorChart
                title="Humidity"
                data={historicalData.humidity}
                unit="%"
                color="hsl(var(--accent))"
                threshold={{ min: 30, max: 70 }}
              />
              <SensorChart
                title="Dust"
                data={historicalData.dust}
                unit="μg/m³"
                color="hsl(var(--warning))"
                threshold={{ max: 20 }}
              />
            </div>
          </div>
          <AlertPanel
            alerts={alerts}
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
