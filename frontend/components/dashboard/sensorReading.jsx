import React, { useState, useEffect } from 'react';

const SensorReading = () => {
  const [autoWatering, setAutoWatering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data - replace with real data from your backend
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
    // TODO: Implement actual watering control logic
  };

  // Water drop icon SVG
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

  // Custom toggle switch component
  const ToggleSwitch = ({ checked, onChange, id }) => (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`
          relative inline-flex items-center cursor-pointer
          w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block w-4 h-4 bg-white rounded-full shadow-lg
            transform transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </label>
    </div>
  );

  return (
    <div className="w-full">
      <h2 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg mb-1' : 'text-xl mb-2'}`}>
        Soil Moisture & Watering Control
      </h2>
      
      <div className={`flex flex-col gap-4 ${isMobile ? 'items-center' : 'items-start'}`}>
        {/* Moisture Reading */}
        <div className={`flex items-center w-full ${isMobile ? 'justify-center' : 'justify-start'}`}>
          <div className={`
            flex items-center gap-3 p-4 rounded-lg transition-all duration-200
            ${getStatusBgColor(sensorData.moisture)}
          `}>
            <WaterDropIcon 
              className={`
                ${isMobile ? 'w-6 h-6' : 'w-7 h-7'} 
                ${getStatusColor(sensorData.moisture)}
              `}
            />
            <div>
              <div className={`
                ${isMobile ? 'text-sm' : 'text-base'} 
                font-medium text-gray-700
              `}>
                Soil Moisture
              </div>
              <div className={`
                ${isMobile ? 'text-lg' : 'text-xl'} 
                font-bold ${getStatusColor(sensorData.moisture)}
              `}>
                {sensorData.moisture}%
              </div>
            </div>
          </div>
        </div>

        {/* Auto Watering Toggle */}
        <div className={`w-full flex ${isMobile ? 'justify-center' : 'justify-start'} mt-2`}>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <ToggleSwitch
              checked={autoWatering}
              onChange={handleAutoWateringChange}
              id="auto-watering-toggle"
            />
            <label 
              htmlFor="auto-watering-toggle"
              className={`
                ${isMobile ? 'text-sm' : 'text-base'} 
                font-medium text-gray-700 cursor-pointer
              `}
            >
              Automatic Watering
            </label>
          </div>
        </div>

        {/* Status indicator */}
        <div className={`w-full flex ${isMobile ? 'justify-center' : 'justify-start'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${
              sensorData.moisture < 30 ? 'bg-red-500' : 
              sensorData.moisture < 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <span>
              {sensorData.moisture < 30 ? 'Dry - Needs Water' : 
               sensorData.moisture < 50 ? 'Moderate - Monitor' : 'Optimal - Good'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorReading;