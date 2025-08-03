-- Create sensor_readings table for storing manual sensor data
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  temperature DECIMAL,
  humidity DECIMAL,
  current DECIMAL,
  vibration DECIMAL,
  gas_emission DECIMAL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since no auth is needed for this demo)
CREATE POLICY "Allow all operations on sensor_readings" 
ON public.sensor_readings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_sensor_readings_device_timestamp ON public.sensor_readings(device_id, timestamp DESC);