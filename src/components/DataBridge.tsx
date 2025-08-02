import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Upload, Wifi, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataBridgeProps {
  onDataReceived: (data: any) => void;
}

export const DataBridge = ({ onDataReceived }: DataBridgeProps) => {
  const [isListening, setIsListening] = useState(false);
  const [serialData, setSerialData] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:3001/api/sensor-data");
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Generate webhook URL for this session
    const sessionId = Math.random().toString(36).substring(7);
    setWebhookUrl(`${window.location.origin}/api/webhook/${sessionId}`);
  }, []);

  const parseSerialData = (rawData: string) => {
    try {
      // Parse the ESP32 serial output format
      const lines = rawData.split('\n');
      const data: any = {};
      
      lines.forEach(line => {
        if (line.includes('Temperature:')) {
          const match = line.match(/Temperature:\s*([\d.]+)/);
          if (match) data.temperature = parseFloat(match[1]);
        }
        if (line.includes('Humidity:')) {
          const match = line.match(/Humidity:\s*([\d.]+)/);
          if (match) data.humidity = parseFloat(match[1]);
        }
        if (line.includes('Current:')) {
          const match = line.match(/Current:\s*([\d.]+)/);
          if (match) data.current = parseFloat(match[1]);
        }
        if (line.includes('Vibration:')) {
          const match = line.match(/Vibration:\s*([\d.]+)/);
          if (match) data.vibration = parseFloat(match[1]);
        }
        if (line.includes('Gas Emission:')) {
          const match = line.match(/Gas Emission:\s*([\d.]+)/);
          if (match) data.gasEmission = parseFloat(match[1]);
        }
      });

      if (Object.keys(data).length > 0) {
        data.timestamp = new Date();
        onDataReceived(data);
        toast({
          title: "Data Received",
          description: "Sensor data updated successfully",
        });
      }
    } catch (error) {
      console.error("Error parsing serial data:", error);
      toast({
        title: "Parse Error",
        description: "Failed to parse sensor data",
        variant: "destructive",
      });
    }
  };

  const handleSerialDataSubmit = () => {
    if (serialData.trim()) {
      parseSerialData(serialData);
      setSerialData("");
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  const downloadArduinoCode = () => {
    const arduinoCode = `
// ESP32 WiFi HTTP Client for Industrial IoT Monitor
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "${apiEndpoint}";

void sendSensorData(float temp, float hum, float current, float vibration, float gas) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    DynamicJsonDocument doc(1024);
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["current"] = current;
    doc["vibration"] = vibration;
    doc["gasEmission"] = gas;
    doc["timestamp"] = millis();
    doc["deviceId"] = "ESP32-001";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Data sent successfully");
    } else {
      Serial.println("Error sending data");
    }
    
    http.end();
  }
}

// Add this to your main loop after reading sensors
void loop() {
  // ... your existing sensor reading code ...
  
  // Send data every 30 seconds
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 30000) {
    sendSensorData(temperature, humidity, current, vibration, gasPPM);
    lastSend = millis();
  }
  
  delay(500);
}
`;

    const blob = new Blob([arduinoCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'esp32_wifi_client.ino';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            <CardTitle>Live Data Bridge</CardTitle>
          </div>
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? "Listening" : "Manual Mode"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Serial Data Input */}
        <div className="space-y-3">
          <h4 className="font-medium">Manual Serial Data Input</h4>
          <p className="text-sm text-muted-foreground">
            Paste Wokwi serial monitor output here to test with live data:
          </p>
          <Textarea
            value={serialData}
            onChange={(e) => setSerialData(e.target.value)}
            placeholder="Paste serial monitor output here..."
            className="min-h-[100px] font-mono text-xs"
          />
          <Button onClick={handleSerialDataSubmit} disabled={!serialData.trim()}>
            <Upload className="h-4 w-4 mr-2" />
            Parse & Update
          </Button>
        </div>

        {/* API Configuration */}
        <div className="space-y-3">
          <h4 className="font-medium">API Configuration</h4>
          <div className="space-y-2">
            <label className="text-sm font-medium">API Endpoint</label>
            <div className="flex gap-2">
              <Input
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:3001/api/sensor-data"
              />
              <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="space-y-3">
          <h4 className="font-medium">Integration Options</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 border rounded-lg space-y-2">
              <h5 className="font-medium text-sm">Option 1: WiFi Integration</h5>
              <p className="text-xs text-muted-foreground">
                Download Arduino code to send data via WiFi
              </p>
              <Button size="sm" variant="outline" onClick={downloadArduinoCode}>
                <Download className="h-3 w-3 mr-1" />
                Download Code
              </Button>
            </div>
            <div className="p-3 border rounded-lg space-y-2">
              <h5 className="font-medium text-sm">Option 2: Serial Bridge</h5>
              <p className="text-xs text-muted-foreground">
                Use a Python script to bridge serial to HTTP
              </p>
              <Button size="sm" variant="outline" disabled>
                <Settings className="h-3 w-3 mr-1" />
                Setup Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h5 className="font-medium text-sm">Setup Instructions:</h5>
          <ol className="text-xs text-muted-foreground space-y-1 ml-4 list-decimal">
            <li>Copy serial output from Wokwi and paste above for testing</li>
            <li>For live integration, download the WiFi client code</li>
            <li>Modify the code with your WiFi credentials and API endpoint</li>
            <li>Flash to your ESP32 for automatic data transmission</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};