import { useState, useEffect } from 'react';
import ESP32Status from './status/ESP32Status';
import MoistureDisplay from './status/MoistureDisplay';
import WateringControls from './status/WateringControls';

const PlantStatus = () => {
  const [autoWatering, setAutoWatering] = useState(false);
  const [sensorData, setSensorData] = useState({
    moisture: 0,
    timestamp: null,
    loading: true,
    error: null
  });
  const [isConnected, setIsConnected] = useState(false);

  // Fetch latest soil moisture data
  const fetchLatestMoisture = async () => {
    try {
      setSensorData(prev => ({ ...prev, error: null }));
      
      // Replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/latest`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.latest_reading) {
        setSensorData({
          moisture: parseFloat(data.latest_reading.moisture_level),
          timestamp: new Date(data.latest_reading.reading_timestamp),
          loading: false,
          error: null
        });
        setIsConnected(true);
      } else {
        throw new Error('No moisture readings found');
      }
    } catch (error) {
      console.error('Error fetching moisture data:', error);
      setSensorData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      setIsConnected(false);
    }
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchLatestMoisture();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLatestMoisture, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-0 sm:mt-20">
      {/* ESP32 Status */}
      <ESP32Status 
        isConnected={isConnected}
        sensorData={sensorData}
        onRefresh={fetchLatestMoisture}
      />

      {/* Moisture Display */}
      <MoistureDisplay 
        sensorData={sensorData}
        isConnected={isConnected}
      />

      {/* Watering Controls - spans full width on larger screens */}
      <div className="lg:col-span-2">
        <WateringControls 
          autoWatering={autoWatering}
          setAutoWatering={setAutoWatering}
          isConnected={isConnected}
          sensorData={sensorData}
        />
      </div>
    </div>
  );
};

export default PlantStatus;