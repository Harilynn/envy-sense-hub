import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SensorData {
  temperature: number;
  humidity: number;
  gasEmission: number;
  vibration: number;
  current: number;
  timestamp: Date;
}

interface HistoricalData {
  temperature: Array<{timestamp: string, value: number}>;
  humidity: Array<{timestamp: string, value: number}>;
  gasEmission: Array<{timestamp: string, value: number}>;
  vibration: Array<{timestamp: string, value: number}>;
  current: Array<{timestamp: string, value: number}>;
}

interface MLAnalysisProps {
  sensorData: SensorData;
  historicalData: HistoricalData;
}

interface PredictionResult {
  riskLevel: "low" | "medium" | "high" | "critical";
  failureProbability: number;
  timeToFailure: string;
  recommendations: string[];
  confidence: number;
}

export const MachineLearningAnalysis = ({ sensorData, historicalData }: MLAnalysisProps) => {
  const [prediction, setPrediction] = useState<PredictionResult>({
    riskLevel: "low",
    failureProbability: 12.5,
    timeToFailure: "45 days",
    recommendations: [
      "Monitor vibration levels closely",
      "Schedule preventive maintenance",
      "Check cooling system efficiency"
    ],
    confidence: 87.2
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate AI analysis
  useEffect(() => {
    const analyzeData = () => {
      setIsAnalyzing(true);
      
      // Simulate ML processing delay
      setTimeout(() => {
        const analysis = performMLAnalysis(sensorData, historicalData);
        setPrediction(analysis);
        setIsAnalyzing(false);
      }, 2000);
    };

    const interval = setInterval(analyzeData, 30000); // Re-analyze every 30 seconds
    analyzeData(); // Initial analysis

    return () => clearInterval(interval);
  }, [sensorData, historicalData]);

  const performMLAnalysis = (current: SensorData, historical: HistoricalData): PredictionResult => {
    // Simplified ML simulation based on sensor thresholds and trends
    let riskScore = 0;
    const recommendations: string[] = [];

    // Temperature analysis
    if (current.temperature > 50) {
      riskScore += 30;
      recommendations.push("Immediate cooling system check required");
    } else if (current.temperature > 40) {
      riskScore += 15;
      recommendations.push("Monitor temperature trends");
    }

    // Vibration analysis
    if (current.vibration > 18000) {
      riskScore += 35;
      recommendations.push("Critical: Check mechanical components for wear");
    } else if (current.vibration > 15000) {
      riskScore += 20;
      recommendations.push("Schedule bearing inspection");
    }

    // Current analysis
    if (current.current > 2.3) {
      riskScore += 25;
      recommendations.push("Investigate electrical load anomalies");
    } else if (current.current > 2.0) {
      riskScore += 10;
      recommendations.push("Monitor power consumption patterns");
    }

    // Gas emission analysis
    if (current.gasEmission > 350) {
      riskScore += 20;
      recommendations.push("Check ventilation and filtration systems");
    }

    // Humidity analysis
    if (current.humidity > 75 || current.humidity < 25) {
      riskScore += 10;
      recommendations.push("Adjust environmental controls");
    }

    // Calculate trend analysis
    const tempTrend = calculateTrend(historical.temperature);
    const vibrationTrend = calculateTrend(historical.vibration);
    
    if (tempTrend > 0.5) riskScore += 15;
    if (vibrationTrend > 0.3) riskScore += 20;

    // Determine risk level and predictions
    let riskLevel: "low" | "medium" | "high" | "critical";
    let timeToFailure: string;
    let failureProbability: number;

    if (riskScore >= 80) {
      riskLevel = "critical";
      failureProbability = Math.min(95, 70 + riskScore * 0.3);
      timeToFailure = "1-3 days";
    } else if (riskScore >= 50) {
      riskLevel = "high";
      failureProbability = Math.min(70, 40 + riskScore * 0.4);
      timeToFailure = "1-2 weeks";
    } else if (riskScore >= 25) {
      riskLevel = "medium";
      failureProbability = Math.min(40, 15 + riskScore * 0.5);
      timeToFailure = "1-2 months";
    } else {
      riskLevel = "low";
      failureProbability = Math.max(5, riskScore * 0.8);
      timeToFailure = "3+ months";
    }

    if (recommendations.length === 0) {
      recommendations.push("System operating within normal parameters");
    }

    const confidence = Math.max(70, Math.min(95, 85 + (historical.temperature.length * 0.5)));

    return {
      riskLevel,
      failureProbability,
      timeToFailure,
      recommendations,
      confidence
    };
  };

  const calculateTrend = (data: Array<{timestamp: string, value: number}>): number => {
    if (data.length < 5) return 0;
    
    const recent = data.slice(-5);
    const older = data.slice(-10, -5);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, point) => sum + point.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, point) => sum + point.value, 0) / older.length;
    
    return (recentAvg - olderAvg) / olderAvg;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "default";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "critical": return <AlertCircle className="h-4 w-4" />;
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const runManualAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = performMLAnalysis(sensorData, historicalData);
      setPrediction(analysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Predictive Analysis</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runManualAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-muted-foreground">AI analyzing sensor patterns...</p>
          </div>
        ) : (
          <>
            {/* Risk Assessment */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getRiskIcon(prediction.riskLevel)}
                  <span className="text-sm font-medium">Risk Level</span>
                </div>
                <Badge variant={getRiskColor(prediction.riskLevel)} className="text-sm">
                  {prediction.riskLevel.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Failure Probability</span>
                </div>
                <div className="space-y-1">
                  <Progress value={prediction.failureProbability} className="h-2" />
                  <span className="text-sm text-muted-foreground">
                    {prediction.failureProbability.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Estimated Time to Failure</span>
                </div>
                <p className="text-sm font-semibold">{prediction.timeToFailure}</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Recommendations
              </h4>
              <div className="space-y-2">
                {prediction.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Confidence */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">Model Confidence</span>
              <div className="flex items-center gap-2">
                <Progress value={prediction.confidence} className="w-20 h-2" />
                <span className="text-sm font-medium">{prediction.confidence.toFixed(1)}%</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};