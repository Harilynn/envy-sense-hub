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
  const [sensorData, setSensorData] = useState<SensorReading[]>(() => {
    const saved = localStorage.getItem('sensorData');
    return saved ? JSON.parse(saved) : [];
  });
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const addSensorData = (data: SensorReading) => {
    setSensorData(prev => {
      const updated = [...prev, data];
      localStorage.setItem('sensorData', JSON.stringify(updated));
      return updated;
    });
  };

  const addAlert = (alert: Alert) => {
    setAlerts(prev => {
      const updated = [...prev, alert];
      localStorage.setItem('alerts', JSON.stringify(updated));
      return updated;
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(alert => 
        alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
      );
      localStorage.setItem('alerts', JSON.stringify(updated));
      return updated;
    });
  };

  const markAlertFixed = (alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(alert => 
        alert.id === alertId ? { ...alert, isFixed: true } : alert
      );
      localStorage.setItem('alerts', JSON.stringify(updated));
      return updated;
    });
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