import React from 'react';


const ESP32Status = ({ isConnected, sensorData, onRefresh }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No data available';
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000 / 60); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return timestamp.toLocaleDateString();
  };

  return (
     <div className="items-center sm:items-start text-center sm:text-left bg-red-50 shadow-lg rounded-2xl p-6 border border-red-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-800">ESP32 Status</h3>
        <button
          onClick={onRefresh}
          className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
          disabled={sensorData.loading}
        >
          {sensorData.loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {sensorData.error && (
        <div className="w-full p-3 mb-4 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-700 text-sm">
            Error: {sensorData.error}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <span className={isConnected ? "text-green-600 text-2xl" : "text-red-600 text-2xl"}>
          {isConnected ? '🟢' : '🔴'}
        </span>
        <div>
          <p className="font-medium text-gray-700">Connection Status</p>
          <p className={`font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Last reading: {formatTimestamp(sensorData.timestamp)}</p>
      </div>
    </div>
  );
};

export default ESP32Status;