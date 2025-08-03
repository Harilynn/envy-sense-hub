import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DataBridgeProps {
  onDataReceived: (data: any) => void;
}

export const DataBridge = ({ onDataReceived }: DataBridgeProps) => {
  const [serialData, setSerialData] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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

      return data;
    } catch (error) {
      console.error("Error parsing serial data:", error);
      return null;
    }
  };

  const saveSensorData = async (data: any) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('sensor_readings')
        .insert([{
          ...data,
          timestamp: new Date().toISOString(),
          device_id: 'ESP32-001'
        }]);

      if (error) throw error;

      toast({
        title: "Data Saved",
        description: "Sensor data saved to database successfully",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Save Error", 
        description: "Failed to save data to database",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSerialDataSubmit = async () => {
    if (serialData.trim()) {
      const parsedData = parseSerialData(serialData);
      
      if (parsedData && Object.keys(parsedData).length > 0) {
        parsedData.timestamp = new Date();
        
        // Update the dashboard
        onDataReceived(parsedData);
        
        // Save to database
        await saveSensorData(parsedData);
        
        setSerialData("");
        
        toast({
          title: "Data Processed",
          description: "Sensor data updated and saved successfully",
        });
      } else {
        toast({
          title: "Parse Error",
          description: "No valid sensor data found in input",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Manual Data Input</CardTitle>
          </div>
          <Badge variant="secondary">
            Manual Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Serial Data Input */}
        <div className="space-y-3">
          <h4 className="font-medium">Wokwi Serial Monitor Data</h4>
          <p className="text-sm text-muted-foreground">
            Paste your Wokwi serial monitor output here to analyze real sensor data:
          </p>
          <Textarea
            value={serialData}
            onChange={(e) => setSerialData(e.target.value)}
            placeholder="==== Sensor Readings ====
Temperature: 23.5 °C
Humidity: 45.2 %
Current: 1.8 A
Vibration: 12000
Gas Emission: 150.0 ppm"
            className="min-h-[120px] font-mono text-xs"
          />
          <Button 
            onClick={handleSerialDataSubmit} 
            disabled={!serialData.trim() || isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Process & Save Data
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h5 className="font-medium text-sm">How to use:</h5>
          <ol className="text-xs text-muted-foreground space-y-1 ml-4 list-decimal">
            <li>Run your Wokwi simulation</li>
            <li>Copy the sensor readings from the serial monitor</li>
            <li>Paste the data in the text area above</li>
            <li>Click "Process & Save Data" to update dashboard and save to database</li>
            <li>View real-time analysis and predictions below</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};