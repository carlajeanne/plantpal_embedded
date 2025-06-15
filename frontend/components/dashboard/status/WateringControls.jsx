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
    <div className="items-center sm:items-start text-center sm:text-left bg-blue-50 shadow-lg rounded-2xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
  <h3 className="text-md font-semibold text-gray-800 mb-4">Watering Controls</h3>
  
  {/* Toggle + Button + Status Info */}
  <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center sm:w-auto gap-10">
    {/* Toggle + Button */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-10">
      <ToggleSwitch
        checked={autoWatering}
        onChange={handleAutoWateringChange}
        id="auto-watering-toggle"
      />
      <button
        className={`px-10 py-3 rounded-lg text-white text-sm font-semibold whitespace-nowrap transition ${
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
    <div className="p-3 bg-gray-50 rounded-md text-left">
      <p className="text-sm text-gray-600">
        <span className="font-medium">Auto-watering:</span> {autoWatering ? 'Enabled' : 'Disabled'}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-medium">System status:</span>{' '}
        {isWatering
          ? 'Watering in progress...'
          : !isConnected
          ? 'Offline'
          : sensorData.loading
          ? 'Loading...'
          : 'Ready'}
      </p>
    </div>
  </div>
</div>

  );
};

export default WateringControls;