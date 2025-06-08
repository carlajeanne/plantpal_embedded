import React, { useState, useEffect } from 'react';

const SensorReading = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sensorData = {
    moisture: 65,
  };

  const getStatusColor = (value) => {
    if (value < 30) return 'text-red-500';
    if (value < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusBgColor = (value) => {
    if (value < 30) return 'bg-red-100';
    if (value < 50) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const handleAutoWateringChange = (event) => {
    setAutoWatering(event.target.checked);
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
      <h2 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg mb-1 mt-20' : 'text-xl mb-3 mt-20  '}`}>
        Soil Moisture & Watering Control
      </h2>

      <div className={`flex flex-col gap-4 ${isMobile ? 'items-center' : 'items-start'} w-[300px] sm:w-[300px]`}>
       {/* Moisture Reading - Cup Style */}
     <div className={`flex flex-col items-center w-full sm:w-96`}>
        <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 mb-3`}>
          Soil Moisture
        </div>

        <div className="relative w-24 h-72 bg-gray-200 rounded-b-full overflow-hidden border border-gray-300 shadow-inner bg-opacity-90 backdrop-blur-sm">
          <div
            className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
            style={{
              height: `${sensorData.moisture}%`,
              backgroundColor:
                sensorData.moisture <= 20
                  ? '#ef4444' // red
                  : sensorData.moisture <= 49
                  ? '#f97316' // orange
                  : sensorData.moisture <= 65
                  ? '#22c55e' // green
                  : sensorData.moisture >= 85
                  ? '#eab308' // yellow
                  : '#d1d5db', // fallback
            }}
          />
          
        </div>

       <div className="flex items-center gap-2 mt-3">
          <span
            className={`${
              sensorData.moisture <= 20
                ? 'text-red-500'
                : sensorData.moisture <= 49
                ? 'text-orange-500'
                : sensorData.moisture <= 65
                ? 'text-green-500'
                : sensorData.moisture >= 85
                ? 'text-yellow-500'
                : 'text-gray-500'
            } ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}
          >
            {sensorData.moisture}%
          </span>
          <span
            className={`w-3 h-3 rounded-full ${
              sensorData.moisture <= 20
                ? 'bg-red-500'
                : sensorData.moisture <= 49
                ? 'bg-orange-500'
                : sensorData.moisture <= 65
                ? 'bg-green-500'
                : sensorData.moisture >= 85
                ? 'bg-yellow-400'
                : 'bg-gray-400'
            }`}
          />
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
