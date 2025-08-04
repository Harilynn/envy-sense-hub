import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SensorReading {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  current: number;
  vibration: number;
  gas_emission: number;
  device_id: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isAcknowledged: boolean;
  isFixed: boolean;
  sensor: string;
  value: number;
  threshold: number;
  suggestions: string[];
  contactInfo?: string;
}

interface SensorDataContextType {
  sensorData: SensorReading[];
  alerts: Alert[];
  addSensorData: (data: SensorReading) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  markAlertFixed: (alertId: string) => void;
  getActiveAlerts: () => Alert[];
  getAcknowledgedAlerts: () => Alert[];
}

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined);

export const useSensorData = () => {
  const context = useContext(SensorDataContext);
  if (!context) {
    throw new Error('useSensorData must be used within a SensorDataProvider');
  }
  return context;
};

export const SensorDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addSensorData = (data: SensorReading) => {
    setSensorData(prev => [...prev, data]);
  };

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [...prev, alert]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
    ));
  };

  const markAlertFixed = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isFixed: true } : alert
    ));
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => !alert.isAcknowledged && !alert.isFixed);
  };

  const getAcknowledgedAlerts = () => {
    return alerts.filter(alert => alert.isAcknowledged || alert.isFixed);
  };

  return (
    <SensorDataContext.Provider
      value={{
        sensorData,
        alerts,
        addSensorData,
        addAlert,
        acknowledgeAlert,
        markAlertFixed,
        getActiveAlerts,
        getAcknowledgedAlerts,
      }}
    >
      {children}
    </SensorDataContext.Provider>
  );
};