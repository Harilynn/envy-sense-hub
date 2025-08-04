import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import jsPDF from 'jspdf';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Calendar
} from "lucide-react";

interface SensorData {
  temperature: number;
  humidity: number;
  gasEmission: number;
  vibration: number;
  current: number;
  timestamp: Date;
}

import { Alert } from "@/contexts/SensorDataContext";

interface AnalysisReportProps {
  sensorData: SensorData;
  historicalData: {
    temperature: Array<{timestamp: string, value: number}>;
    humidity: Array<{timestamp: string, value: number}>;
    gasEmission: Array<{timestamp: string, value: number}>;
    vibration: Array<{timestamp: string, value: number}>;
    current: Array<{timestamp: string, value: number}>;
  };
  alerts: Alert[];
}

export const AnalysisReport = ({ sensorData, historicalData, alerts }: AnalysisReportProps) => {
  // Calculate performance metrics
  const calculateAverage = (data: Array<{value: number}>) => {
    if (data.length === 0) return 0;
    return data.reduce((sum, item) => sum + item.value, 0) / data.length;
  };

  const calculateTrend = (data: Array<{value: number}>) => {
    if (data.length < 2) return "stable";
    const recent = data.slice(-3).map(d => d.value);
    const earlier = data.slice(-6, -3).map(d => d.value);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, val) => sum + val, 0) / earlier.length;
    
    if (recentAvg > earlierAvg * 1.05) return "up";
    if (recentAvg < earlierAvg * 0.95) return "down";
    return "stable";
  };

  const metrics = {
    temperature: {
      current: sensorData.temperature,
      average: calculateAverage(historicalData.temperature),
      trend: calculateTrend(historicalData.temperature),
      status: sensorData.temperature > 60 ? "danger" : sensorData.temperature > 45 ? "warning" : "good"
    },
    humidity: {
      current: sensorData.humidity,
      average: calculateAverage(historicalData.humidity),
      trend: calculateTrend(historicalData.humidity),
      status: sensorData.humidity > 80 || sensorData.humidity < 20 ? "danger" : sensorData.humidity > 70 || sensorData.humidity < 30 ? "warning" : "good"
    },
    gasEmission: {
      current: sensorData.gasEmission,
      average: calculateAverage(historicalData.gasEmission),
      trend: calculateTrend(historicalData.gasEmission),
      status: sensorData.gasEmission > 400 ? "danger" : sensorData.gasEmission > 300 ? "warning" : "good"
    },
    vibration: {
      current: sensorData.vibration,
      average: calculateAverage(historicalData.vibration),
      trend: calculateTrend(historicalData.vibration),
      status: sensorData.vibration > 20000 ? "danger" : sensorData.vibration > 15000 ? "warning" : "good"
    },
    current: {
      current: sensorData.current,
      average: calculateAverage(historicalData.current),
      trend: calculateTrend(historicalData.current),
      status: sensorData.current > 2.5 ? "danger" : sensorData.current > 2.0 ? "warning" : "good"
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.isAcknowledged && !alert.isFixed);
  const resolvedAlerts = alerts.filter(alert => alert.isFixed);
  const totalAlerts = alerts.length;

  const overallHealth = Object.values(metrics).reduce((acc, metric) => {
    if (metric.status === "good") return acc + 100;
    if (metric.status === "warning") return acc + 60;
    return acc + 20;
  }, 0) / Object.keys(metrics).length;

  const generateReport = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('SmartMonitor Analysis Report', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
    
    // System Overview
    pdf.setFontSize(16);
    pdf.text('System Overview', 20, 65);
    
    pdf.setFontSize(10);
    pdf.text(`Overall Health Score: ${overallHealth.toFixed(1)}%`, 20, 80);
    pdf.text(`Temperature: ${sensorData.temperature}°C (${metrics.temperature.status})`, 20, 95);
    pdf.text(`Humidity: ${sensorData.humidity}% (${metrics.humidity.status})`, 20, 105);
    pdf.text(`Gas Emission: ${sensorData.gasEmission} ppm (${metrics.gasEmission.status})`, 20, 115);
    pdf.text(`Vibration: ${sensorData.vibration} (${metrics.vibration.status})`, 20, 125);
    pdf.text(`Current: ${sensorData.current}A (${metrics.current.status})`, 20, 135);
    
    // Alert Summary
    pdf.setFontSize(16);
    pdf.text('Alert Summary', 20, 155);
    
    pdf.setFontSize(10);
    pdf.text(`Active Alerts: ${activeAlerts.length}`, 20, 170);
    pdf.text(`Resolved Alerts: ${resolvedAlerts.length}`, 20, 180);
    pdf.text(`Total Alerts: ${totalAlerts}`, 20, 190);
    
    // Active Alerts Details
    if (activeAlerts.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Active Alerts Details', 20, 210);
      
      let yPos = 225;
      activeAlerts.forEach((alert, index) => {
        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${alert.title}`, 25, yPos);
        pdf.text(`   ${alert.message}`, 25, yPos + 10);
        pdf.text(`   Sensor: ${alert.sensor}`, 25, yPos + 20);
        yPos += 35;
        
        if (yPos > 280) {
          pdf.addPage();
          yPos = 30;
        }
      });
    }
    
    // Download the PDF
    pdf.save(`smartmonitor-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500">Good</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Warning</Badge>;
      case "danger":
        return <Badge variant="destructive">Danger</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analysis Report</h2>
          <p className="text-muted-foreground">Comprehensive system performance analysis</p>
        </div>
        <Button onClick={generateReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{overallHealth.toFixed(1)}%</span>
              {overallHealth >= 80 ? (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Excellent
                </Badge>
              ) : overallHealth >= 60 ? (
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Good
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Needs Attention
                </Badge>
              )}
            </div>
            <Progress value={overallHealth} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Based on current sensor readings and historical performance data
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics).map(([key, metric]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      Current: {metric.current.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg: {metric.average.toFixed(1)}
                    </div>
                  </div>
                  {getStatusBadge(metric.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-destructive">{activeAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{resolvedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Resolved Alerts</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{totalAlerts}</div>
              <div className="text-sm text-muted-foreground">Total Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">Immediate Actions</h4>
              <ul className="space-y-1 text-sm">
                {activeAlerts.length > 0 ? (
                  activeAlerts.map(alert => (
                    <li key={alert.id}>• Address {alert.title.toLowerCase()}</li>
                  ))
                ) : (
                  <li>• No immediate actions required</li>
                )}
              </ul>
            </div>
            
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Preventive Measures</h4>
              <ul className="space-y-1 text-sm">
                <li>• Schedule regular sensor calibration</li>
                <li>• Monitor trending parameters closely</li>
                <li>• Update maintenance schedules based on usage patterns</li>
                <li>• Consider predictive maintenance protocols</li>
              </ul>
            </div>
            
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-2">Optimization Opportunities</h4>
              <ul className="space-y-1 text-sm">
                <li>• Fine-tune operational parameters for efficiency</li>
                <li>• Implement automated response protocols</li>
                <li>• Enhance data collection frequency for critical sensors</li>
                <li>• Consider machine learning model improvements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Generated</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Points</p>
              <p className="font-medium">{historicalData.temperature.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Period</p>
              <p className="font-medium">Last 24 hours</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Device</p>
              <p className="font-medium">ESP32-001</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};