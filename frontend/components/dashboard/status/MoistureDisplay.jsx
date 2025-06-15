import React from 'react';
import { Droplet, Flower, Droplets} from 'lucide-react';

const MoistureDisplay = ({ sensorData, isConnected }) => {
  const getStatusColor = (value) => {
    if (value <= 20) return '#ef4444'; // red
    if (value <= 49) return '#f97316'; // orange
    if (value <= 65) return '#22c55e'; // green
    if (value >= 85) return '#eab308'; // yellow
    return '#6b7280';
  };

  const getPlantStatus = () => {
    if (sensorData.error || !isConnected) return 'Offline';
    if (sensorData.moisture <= 20) return 'Needs Water';
    if (sensorData.moisture <= 49) return 'Low Moisture';
    if (sensorData.moisture <= 65) return 'Healthy';
    if (sensorData.moisture >= 85) return 'Over Watered';
    return 'Unknown';
  };

  const getStatusDescription = () => {
    if (sensorData.error) return 'Connection error';
    if (!isConnected) return 'Device offline';
    if (sensorData.moisture <= 20) return 'Critical - Water immediately';
    if (sensorData.moisture <= 49) return 'Plant needs watering soon';
    if (sensorData.moisture <= 65) return 'Optimal moisture level';
    if (sensorData.moisture >= 85) return 'Too much water detected';
    return 'Monitoring...';
  };

  return (
     <div className="items-center sm:items-start text-center sm:text-left bg-green-50 shadow-lg rounded-2xl p-6 border border-green-100 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-md font-semibold text-gray-800 mb-4">Plant Status</h3>
      
      {/* Plant Overview */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-6">
        <div className="flex justify-center items-center w-20 h-20 sm:w-24 sm:h-24">
          <Flower 
            size={60} 
            className={
              sensorData.loading 
                ? 'text-gray-400' 
                : isConnected 
                  ? 'text-green-600' 
                  : 'text-red-500'
            } 
          />
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <p className={`text-base font-semibold ${
            sensorData.loading 
              ? 'text-gray-400' 
              : isConnected 
                ? 'text-green-600' 
                : 'text-red-500'
          }`}>
            {sensorData.loading ? 'Loading...' : getPlantStatus()}
          </p>
          <p className="text-sm text-gray-500">
            {getStatusDescription()}
          </p>
        </div>
      </div>

      {/* Moisture Readings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
        {/* Current Moisture */}
        <div className="flex items-center gap-2">
          <Droplet className="text-blue-600" size={20} />
          <span className="font-medium text-gray-700">Moisture:</span>
          <span
            className="font-bold"
            style={{ color: getStatusColor(sensorData.moisture) }}
          >
            {sensorData.loading ? '--' : `${sensorData.moisture.toFixed(1)}%`}
          </span>
        </div>

        {/* Water Need */}
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-600" size={20} />
          <span className="font-medium text-gray-700">Needs Water:</span>
          <span
            className="font-bold"
            style={{ color: sensorData.moisture < 30 ? '#ef4444' : '#22c55e' }}
          >
            {sensorData.loading ? '--' : (sensorData.moisture < 30 ? 'Yes' : 'No')}
          </span>
        </div>
      </div>

      {/* Moisture Level Indicator */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Moisture Level</span>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(Math.max(sensorData.moisture, 0), 100)}%`,
              backgroundColor: getStatusColor(sensorData.moisture)
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default MoistureDisplay;