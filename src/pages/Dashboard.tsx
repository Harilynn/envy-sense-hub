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

interface LocalSensorData {
  temperature: number;
  humidity: number;
  gasEmission: number;
  vibration: number;
  current: number;
  timestamp: Date;
}

const Dashboard = () => {
  const location = useLocation();
  const isDashboardRoot = location.pathname === "/dashboard";
  const { getActiveAlerts, getAcknowledgedAlerts, addAlert, acknowledgeAlert, markAlertFixed, addSensorData } = useSensorData();

  const [localSensorData, setLocalSensorData] = useState<LocalSensorData>(() => {
    const saved = localStorage.getItem('smartmonitor-sensor-data');
    return saved ? JSON.parse(saved) : {
      temperature: 23.5,
      humidity: 45.2,
      gasEmission: 150.0,
      vibration: 12000.0,
      current: 1.8,
      timestamp: new Date()
    };
  });

  // Load and restore alerts on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('smartmonitor-alerts');
    if (savedAlerts) {
      const alerts = JSON.parse(savedAlerts);
      alerts.forEach((alert: any) => {
        if (!alert.isAcknowledged && !alert.isFixed) {
          addAlert(alert);
        }
      });
    }
  }, [addAlert]);

  const [historicalData, setHistoricalData] = useState(() => {
    const saved = localStorage.getItem('smartmonitor-historical-data');
    return saved ? JSON.parse(saved) : {
      temperature: [] as Array<{timestamp: string, value: number}>,
      humidity: [] as Array<{timestamp: string, value: number}>,
      gasEmission: [] as Array<{timestamp: string, value: number}>,
      vibration: [] as Array<{timestamp: string, value: number}>,
      current: [] as Array<{timestamp: string, value: number}>
    };
  });

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

  const handleDismissAlert = (alertId: string) => {
    // Remove from context alerts
  };

  const activeAlerts = getActiveAlerts();
  const acknowledgedAlerts = getAcknowledgedAlerts();
  const allAlertsFixed = acknowledgedAlerts.length > 0 && acknowledgedAlerts.every(alert => alert.isFixed);

  return (
    <div className="min-h-screen bg-gradient-bg-primary">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {isDashboardRoot && (
          <>
            {/* System Status Banner */}
            {activeAlerts.length === 0 && allAlertsFixed ? (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 animate-fade-in">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-full">
                    <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-success">System Operating Normally</h3>
                    <p className="text-sm text-success/80">All sensors are within safe operating parameters</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-full">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : null}

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
                    value={localSensorData.temperature}
                    unit="°C"
                    status={getTemperatureStatus(localSensorData.temperature)}
                    icon={<Thermometer className="h-4 w-4" />}
                    threshold={{ min: 18, max: 60 }}
                    trend={localSensorData.temperature > 45 ? "up" : localSensorData.temperature < 25 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Humidity"
                    value={localSensorData.humidity}
                    unit="%"
                    status={getHumidityStatus(localSensorData.humidity)}
                    icon={<Droplets className="h-4 w-4" />}
                    threshold={{ min: 20, max: 80 }}
                    trend={localSensorData.humidity > 70 ? "up" : localSensorData.humidity < 30 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Gas Emission"
                    value={localSensorData.gasEmission}
                    unit="ppm"
                    status={getGasStatus(localSensorData.gasEmission)}
                    icon={<AlertTriangle className="h-4 w-4" />}
                    threshold={{ min: 0, max: 400 }}
                    trend={localSensorData.gasEmission > 300 ? "up" : localSensorData.gasEmission < 150 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Vibration"
                    value={localSensorData.vibration}
                    unit=""
                    status={getVibrationStatus(localSensorData.vibration)}
                    icon={<Activity className="h-4 w-4" />}
                    threshold={{ min: 0, max: 20000 }}
                    trend={localSensorData.vibration > 15000 ? "up" : localSensorData.vibration < 10000 ? "down" : "stable"}
                  />
                  <SensorCard
                    title="Current"
                    value={localSensorData.current}
                    unit="A"
                    status={getCurrentStatus(localSensorData.current)}
                    icon={<Zap className="h-4 w-4" />}
                    threshold={{ min: 0, max: 2.5 }}
                    trend={localSensorData.current > 2.0 ? "up" : localSensorData.current < 1.2 ? "down" : "stable"}
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
                    onAcknowledge={acknowledgeAlert}
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
                  const newSensorData = { ...data };
                  setLocalSensorData(newSensorData);
                  
                  // Persist to localStorage
                  localStorage.setItem('smartmonitor-sensor-data', JSON.stringify(newSensorData));
                  
                  // Persist current alerts to localStorage
                  const allAlerts = [...getActiveAlerts(), ...getAcknowledgedAlerts()];
                  localStorage.setItem('smartmonitor-alerts', JSON.stringify(allAlerts));
                  
                  // Add to context
                  addSensorData({
                    id: `sensor-${Date.now()}`,
                    timestamp: data.timestamp.toISOString(),
                    temperature: data.temperature,
                    humidity: data.humidity,
                    current: data.current,
                    vibration: data.vibration,
                    gas_emission: data.gasEmission,
                    device_id: "ESP32-001"
                  });
                  
                  const timeStr = data.timestamp.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });

                  const newHistoricalData = {
                    temperature: [...historicalData.temperature.slice(-19), { timestamp: timeStr, value: data.temperature }],
                    humidity: [...historicalData.humidity.slice(-19), { timestamp: timeStr, value: data.humidity }],
                    gasEmission: [...historicalData.gasEmission.slice(-19), { timestamp: timeStr, value: data.gasEmission }],
                    vibration: [...historicalData.vibration.slice(-19), { timestamp: timeStr, value: data.vibration }],
                    current: [...historicalData.current.slice(-19), { timestamp: timeStr, value: data.current }]
                  };
                  
                  setHistoricalData(newHistoricalData);
                  localStorage.setItem('smartmonitor-historical-data', JSON.stringify(newHistoricalData));

                  // Generate alerts with detailed suggestions
                  if (data.temperature > 60) {
                    addAlert({
                      id: `temp-${Date.now()}`,
                      type: "danger",
                      title: "Critical Temperature Alert",
                      message: `Temperature exceeded 60°C (Current: ${data.temperature.toFixed(1)}°C)`,
                      timestamp: new Date().toISOString(),
                      isAcknowledged: false,
                      isFixed: false,
                      sensor: "Temperature Sensor",
                      value: data.temperature,
                      threshold: 60,
                      suggestions: [
                        "Immediately check cooling system operation and coolant levels",
                        "Reduce machine load by 50% to lower heat generation",
                        "Ensure proper ventilation and air circulation around equipment",
                        "Inspect heat exchangers for blockages or fouling",
                        "Consider emergency shutdown if temperature continues to rise",
                        "Check for mechanical friction or binding in moving parts"
                      ],
                      contactInfo: "For emergency support, contact our technical team immediately"
                    });
                  }
                  if (data.current > 2.5) {
                    addAlert({
                      id: `current-${Date.now()}`,
                      type: "danger", 
                      title: "Electrical Current Overload",
                      message: `Current exceeded safe threshold (Current: ${data.current.toFixed(1)} A)`,
                      timestamp: new Date().toISOString(),
                      isAcknowledged: false,
                      isFixed: false,
                      sensor: "Current Sensor",
                      value: data.current,
                      threshold: 2.5,
                      suggestions: [
                        "Immediately check all electrical connections for looseness",
                        "Inspect motor windings for signs of damage or overheating",
                        "Look for short circuits in wiring or control panels",
                        "Check mechanical load on motor for binding or obstruction",
                        "Reduce operational speed to decrease current draw",
                        "Test insulation resistance of motor windings",
                        "Consider temporary load reduction until issue is resolved"
                      ],
                      contactInfo: "Contact certified electrician for electrical system inspection"
                    });
                  }
                  if (data.vibration > 20000) {
                    addAlert({
                      id: `vibration-${Date.now()}`,
                      type: "danger",
                      title: "Critical Vibration Level", 
                      message: `Excessive vibrations detected (Current: ${data.vibration.toFixed(0)})`,
                      timestamp: new Date().toISOString(),
                      isAcknowledged: false,
                      isFixed: false,
                      sensor: "Vibration Sensor",
                      value: data.vibration,
                      threshold: 20000,
                      suggestions: [
                        "Stop operation immediately to prevent catastrophic failure",
                        "Inspect all bearings for wear, damage, or inadequate lubrication",
                        "Check shaft alignment using precision alignment tools",
                        "Examine mounting bolts and foundation for looseness",
                        "Look for signs of component wear, cracking, or fatigue",
                        "Check balance of rotating components",
                        "Schedule immediate professional vibration analysis"
                      ],
                      contactInfo: "Emergency mechanical support required - contact maintenance team"
                    });
                  }
                  if (data.gasEmission > 400) {
                    addAlert({
                      id: `gas-${Date.now()}`,
                      type: "danger",
                      title: "Hazardous Gas Concentration",
                      message: `Gas concentration critical (Current: ${data.gasEmission.toFixed(1)} ppm)`,
                      timestamp: new Date().toISOString(),
                      isAcknowledged: false,
                      isFixed: false,
                      sensor: "Gas Sensor",
                      value: data.gasEmission,
                      threshold: 400,
                      suggestions: [
                        "Evacuate personnel from affected area immediately",
                        "Activate emergency ventilation systems",
                        "Check for gas leaks in piping, valves, and connections",
                        "Inspect gas detection equipment calibration",
                        "Monitor air quality continuously with portable detectors",
                        "Implement confined space entry procedures if applicable",
                        "Do not operate electrical equipment in affected area"
                      ],
                      contactInfo: "Emergency response team - contact safety officer immediately"
                    });
                  }
                  if (data.humidity > 80) {
                    addAlert({
                      id: `humidity-${Date.now()}`,
                      type: "warning",
                      title: "Elevated Humidity Levels",
                      message: `Humidity exceeds normal range (Current: ${data.humidity.toFixed(1)}%)`,
                      timestamp: new Date().toISOString(),
                      isAcknowledged: false,
                      isFixed: false,
                      sensor: "Humidity Sensor",
                      value: data.humidity,
                      threshold: 80,
                      suggestions: [
                        "Increase air circulation using fans or HVAC system",
                        "Deploy dehumidification equipment in affected areas",
                        "Check for water leaks in pipes, roof, or foundation",
                        "Inspect steam sources and ensure proper ventilation",
                        "Monitor condensation on equipment and surfaces",
                        "Check humidity sensor calibration and placement"
                      ],
                      contactInfo: "Contact facilities management for HVAC support"
                    });
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
                        <p className="text-sm">{localSensorData.timestamp.toLocaleString()}</p>
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
                <MachineLearningAnalysis sensorData={localSensorData} historicalData={historicalData} />
              </TabsContent>

              <TabsContent value="reports">
                <AnalysisReport sensorData={localSensorData} historicalData={historicalData} alerts={activeAlerts} />
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