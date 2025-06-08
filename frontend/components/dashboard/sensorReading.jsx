import React, { useState, useEffect } from 'react';

const SensorReading = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sensorData, setSensorData] = useState({
    moisture: 0,
    timestamp: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      } else {
        throw new Error('No moisture readings found');
      }
    } catch (error) {
      console.error('Error fetching moisture data:', error);
      setSensorData(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchLatestMoisture();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLatestMoisture, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value) => {
    if (value <= 20) return 'text-red-500';
    if (value <= 49) return 'text-orange-500';
    if (value <= 65) return 'text-green-500';
    if (value >= 85) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getMoistureBarColor = (value) => {
    if (value <= 20) return '#ef4444'; // red
    if (value <= 49) return '#f97316'; // orange
    if (value <= 65) return '#22c55e'; // green
    if (value >= 85) return '#eab308'; // yellow
    return '#d1d5db'; // fallback gray
  };

  const getStatusDotColor = (value) => {
    if (value <= 20) return 'bg-red-500';
    if (value <= 49) return 'bg-orange-500';
    if (value <= 65) return 'bg-green-500';
    if (value >= 85) return 'bg-yellow-400';
    return 'bg-gray-400';
  };

  const getStatusText = (value) => {
    if (value <= 20) return 'No Moisture';
    if (value <= 49) return 'Needs Watering';
    if (value <= 65) return 'Normal';
    if (value >= 85) return 'Over Moisture';
    return 'Unknown';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No data';
    return timestamp.toLocaleString();
  };

  const WaterDropIcon = ({ className }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/>
    </svg>
  );

  return (
    <div className="w-full h-full pl-4 pr-4 sm:pl-20 sm:pr-6 py-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg mb-1 mt-20' : 'text-xl mb-3 mt-20'}`}>
          Soil Moisture & Watering Control
        </h2>
        
        <button
          onClick={fetchLatestMoisture}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className={`flex flex-col gap-4 ${isMobile ? 'items-center' : 'items-start'} w-[300px] sm:w-[300px]`}>
        {/* Error Display */}
        {sensorData.error && (
          <div className="w-full p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-700 text-sm">
              Error: {sensorData.error}
            </p>
          </div>
        )}

        {/* Moisture Reading - Cup Style */}
        <div className={`flex flex-col items-center w-full sm:w-96`}>
          <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 mb-3`}>
            Soil Moisture
          </div>

          <div className="relative w-24 h-72 bg-gray-200 rounded-b-full overflow-hidden border border-gray-300 shadow-inner bg-opacity-90 backdrop-blur-sm">
            <div
              className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
              style={{
                height: `${Math.min(Math.max(sensorData.moisture, 0), 100)}%`,
                backgroundColor: getMoistureBarColor(sensorData.moisture)
              }}
            />
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span
              className={`${getStatusColor(sensorData.moisture)} ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}
            >
              {`${sensorData.moisture.toFixed(1)}%`}
            </span>
            <span
              className={`w-3 h-3 rounded-full ${getStatusDotColor(sensorData.moisture)}`}
            />
          </div>

          {/* Status Text */}
          <div className="mt-2 text-center">
            <span className={`text-sm font-medium ${getStatusColor(sensorData.moisture)}`}>
              {getStatusText(sensorData.moisture)}
            </span>
          </div>

          {/* Timestamp */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Last updated: {formatTimestamp(sensorData.timestamp)}
          </div>
        </div>

        {/* Moisture Status Legend */}
        <div className={`w-full flex flex-col gap-1 ${isMobile ? 'items-center mt-4' : 'items-start mt-6'} sm:w-96`}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Over Moisture (85–100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span>Normal (50–65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Needs Watering (30–49%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>No Moisture (0–20%)</span>
            </div>
          </div>
        </div>    
      </div>
    </div>
  );
};

export default SensorReading;