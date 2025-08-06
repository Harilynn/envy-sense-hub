import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { 
  Cpu, 
  Thermometer, 
  Droplets, 
  Activity, 
  Zap, 
  AlertTriangle,
  Wifi,
  Settings,
  ShieldCheck,
  ArrowLeft,
  BookOpen,
  Wrench,
  Phone,
  Clock
} from "lucide-react";

export default function LearnMore() {
  const esp32Features = [
    {
      title: "32-bit Dual-Core Processor",
      description: "Xtensa LX6 CPU running at 240MHz for high-performance data processing",
      icon: <Cpu className="h-6 w-6" />
    },
    {
      title: "Wi-Fi & Bluetooth",
      description: "Built-in connectivity for seamless data transmission and device integration",
      icon: <Wifi className="h-6 w-6" />
    },
    {
      title: "Low Power Design",
      description: "Ultra-low power consumption perfect for continuous industrial monitoring",
      icon: <Settings className="h-6 w-6" />
    }
  ];

  const sensors = [
    {
      name: "Temperature Sensor (DS18B20)",
      range: "-55°C to +125°C",
      accuracy: "±0.5°C",
      description: "Waterproof digital temperature sensor for accurate thermal monitoring",
      icon: <Thermometer className="h-6 w-6 text-red-500" />,
      maintenance: "Clean sensor probe monthly, check cable connections quarterly"
    },
    {
      name: "Humidity Sensor (DHT22)",
      range: "0-100% RH",
      accuracy: "±2% RH",
      description: "High-precision humidity and temperature sensor for environmental monitoring",
      icon: <Droplets className="h-6 w-6 text-blue-500" />,
      maintenance: "Keep sensor dry when not in use, calibrate annually"
    },
    {
      name: "Current Sensor (ACS712)",
      range: "0-30A AC/DC",
      accuracy: "±1.5%",
      description: "Hall-effect current sensor for electrical load monitoring",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      maintenance: "Check wire connections monthly, ensure proper isolation"
    },
    {
      name: "Vibration Sensor (SW-420)",
      range: "0-20000 units",
      accuracy: "High sensitivity",
      description: "Digital vibration sensor for mechanical fault detection",
      icon: <Activity className="h-6 w-6 text-purple-500" />,
      maintenance: "Mount securely, check mounting bolts weekly"
    },
    {
      name: "Gas Sensor (MQ-135)",
      range: "10-1000 ppm",
      accuracy: "±10%",
      description: "Air quality sensor detecting NH3, NOx, alcohol, benzene, smoke, CO2",
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      maintenance: "Preheat 24 hours before first use, clean monthly with soft brush"
    }
  ];

  const maintenanceSchedule = [
    { task: "Visual inspection of all sensors", frequency: "Weekly", duration: "15 minutes" },
    { task: "Check all cable connections", frequency: "Monthly", duration: "30 minutes" },
    { task: "Clean sensor housings", frequency: "Monthly", duration: "45 minutes" },
    { task: "Calibrate sensors", frequency: "Quarterly", duration: "2 hours" },
    { task: "Full system testing", frequency: "Semi-annually", duration: "4 hours" },
    { task: "Replace batteries (if applicable)", frequency: "Annually", duration: "1 hour" }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg-secondary">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartMonitor Technical Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete guide to operating, maintaining, and troubleshooting your industrial IoT monitoring system
          </p>
        </div>

        {/* ESP32 Overview */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            ESP32 Microcontroller
          </h2>
          <Card className="bg-gradient-card border border-primary/20">
            <CardHeader>
              <CardTitle>The Heart of SmartMonitor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The ESP32 is a powerful, low-cost microcontroller with integrated Wi-Fi and Bluetooth capabilities. 
                It serves as the central processing unit for all sensor data collection, processing, and transmission.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {esp32Features.map((feature, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-primary">{feature.icon}</div>
                      <h4 className="font-semibold">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sensors Detail */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-success" />
            Sensor Components
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sensors.map((sensor, index) => (
              <Card key={index} className="bg-gradient-card border border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {sensor.icon}
                    {sensor.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{sensor.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Range:</span>
                      <p className="text-muted-foreground">{sensor.range}</p>
                    </div>
                    <div>
                      <span className="font-medium">Accuracy:</span>
                      <p className="text-muted-foreground">{sensor.accuracy}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
                    <h5 className="font-medium text-info mb-1 flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Maintenance
                    </h5>
                    <p className="text-sm text-muted-foreground">{sensor.maintenance}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Maintenance Schedule */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-warning" />
            Maintenance Schedule
          </h2>
          <Card className="bg-gradient-card border border-primary/20">
            <CardHeader>
              <CardTitle>Recommended Maintenance Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceSchedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.task}</h4>
                      <p className="text-sm text-muted-foreground">Duration: {item.duration}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {item.frequency}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Operating Instructions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" />
            Operating Instructions
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-card border border-primary/20">
              <CardHeader>
                <CardTitle>Setup & Installation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Connect all sensors to designated ESP32 pins</li>
                  <li>Power on the ESP32 using 5V DC supply</li>
                  <li>Configure Wi-Fi settings through serial monitor</li>
                  <li>Verify sensor readings in the dashboard</li>
                  <li>Set appropriate alert thresholds</li>
                  <li>Begin continuous monitoring</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border border-primary/20">
              <CardHeader>
                <CardTitle>Daily Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Check dashboard for any active alerts</li>
                  <li>Monitor sensor readings for anomalies</li>
                  <li>Acknowledge and resolve any warnings</li>
                  <li>Review trend analysis for patterns</li>
                  <li>Document any maintenance performed</li>
                  <li>Export daily reports for record keeping</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Support */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6 text-destructive" />
            Support & Contact Information
          </h2>
          <Card className="bg-destructive/5 border border-destructive/20">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold text-destructive mb-2">Emergency Support</h4>
                  <p className="text-sm">24/7 Critical Issues</p>
                  <p className="text-sm font-mono">+1-800-SMART-01</p>
                </div>
                <div>
                  <h4 className="font-semibold text-warning mb-2">Technical Support</h4>
                  <p className="text-sm">Monday-Friday 8AM-6PM</p>
                  <p className="text-sm font-mono">tech@smartmonitor.io</p>
                </div>
                <div>
                  <h4 className="font-semibold text-info mb-2">General Inquiries</h4>
                  <p className="text-sm">Business Hours</p>
                  <p className="text-sm font-mono">info@smartmonitor.io</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <Button size="lg" asChild className="hover-scale bg-gradient-primary text-white">
            <Link to="/dashboard">
              Start Monitoring Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}