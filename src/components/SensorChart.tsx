import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
  timestamp: string;
  value: number;
}

interface SensorChartProps {
  title: string;
  data: DataPoint[];
  unit: string;
  color: string;
  threshold?: {
    min?: number;
    max?: number;
  };
}

export const SensorChart = ({ title, data, unit, color, threshold }: SensorChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title} Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="timestamp" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, title]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
            />
            {threshold?.max && (
              <Line 
                type="monotone"
                dataKey={() => threshold.max}
                stroke="hsl(var(--danger))"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1}
              />
            )}
            {threshold?.min && (
              <Line 
                type="monotone"
                dataKey={() => threshold.min}
                stroke="hsl(var(--warning))"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};