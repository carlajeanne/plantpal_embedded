import React, { useState } from 'react';

const WateringControls = ({ 
  autoWatering, 
  setAutoWatering, 
  isConnected, 
  sensorData 
}) => {
  const [isWatering, setIsWatering] = useState(false);

  const handleAutoWateringChange = (e) => {
    setAutoWatering(e.target.checked);
  };

  const handleWaterNow = async () => {
    try {
      setIsWatering(true);
      setTimeout(() => {
        setIsWatering(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error triggering watering:', error);
      setIsWatering(false);
      alert('Failed to trigger watering system');
    }
  };

  const ToggleSwitch = ({ checked, onChange, id }) => (
    <div className="flex flex-col items-start sm:items-center gap-1 w-full">
      <label htmlFor={id} className="text-gray-700 font-medium">
        Automatic Watering
      </label>
      <div className="relative w-20 h-10">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`block w-20 h-10 rounded-full cursor-pointer transition-colors duration-300 ${
            checked ? 'bg-green-300' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 text-lg transition-transform duration-300 ${
              checked ? 'translate-x-11' : 'translate-x-0'
            }`}
          >
            🌸
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-gray-100">
      <h3 className="text-md font-semibold text-gray-800 mb-4">Watering Controls</h3>
      
      {/* Toggle + Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ToggleSwitch
          checked={autoWatering}
          onChange={handleAutoWateringChange}
          id="auto-watering-toggle"
        />
        <button
          className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition ${
            isWatering 
              ? 'bg-green-600 animate-pulse cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          }`}
          onClick={handleWaterNow}
          disabled={!isConnected || sensorData.loading || isWatering}
        >
          {isWatering ? '💧 Watering...' : sensorData.loading ? 'Loading...' : 'Water Now'}
        </button>
      </div>

      {/* Status Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Auto-watering:</span> {autoWatering ? 'Enabled' : 'Disabled'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">System status:</span> {
            isWatering ? 'Watering in progress...' :
            !isConnected ? 'Offline' : 
            sensorData.loading ? 'Loading...' : 
            'Ready'
          }
        </p>
      </div>
    </div>
  );
};

export default WateringControls;