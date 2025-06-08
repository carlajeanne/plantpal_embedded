import { useState } from 'react';
import { Flower, Droplet, Sun, Thermometer } from 'lucide-react';

const plantData = {
  moisture: 65,
  light: 75,
  temperature: 22,
  status: 'Healthy',
  lastWatered: '2025-06-06',
  nextWatering: '2025-06-10',
};

const PlantStatus = () => {
  const [autoWatering, setAutoWatering] = useState(false);
  const isConnected = true;

  const getStatusColor = (value, type) => {
    switch (type) {
      case 'moisture':
        return value < 30 ? '#ef4444' : value < 60 ? '#f59e0b' : '#22c55e';
      case 'light':
        return value < 40 ? '#ef4444' : value < 70 ? '#f59e0b' : '#22c55e';
      case 'temperature':
        return value < 15 || value > 30 ? '#ef4444' : '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const handleAutoWateringChange = (e) => {
    setAutoWatering(e.target.checked);
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
      {/* Background Track */}
      <label
        htmlFor={id}
        className={`block w-20 h-10 rounded-full cursor-pointer transition-colors duration-300 ${
          checked ? 'bg-green-300' : 'bg-gray-300'
        }`}
      >
        {/* Flower Emoji as Toggle */}
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
   <div className="flex flex-col sm:flex-row gap-4 mt-0 sm:mt-20">
      {/* Plant Overview Section */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left bg-white shadow-md rounded-xl p-4 sm:p-6 w-full sm:w-1/2">
        <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Plant Status Overview</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
          <div className="flex justify-center items-center w-20 h-20 sm:w-24 sm:h-24 text-green-600">
            <Flower size={60} />
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-base font-semibold text-green-600">{plantData.status}</p>
            <p className="text-sm text-gray-500">Last checked: 5 minutes ago</p>
            <p className="text-sm text-gray-500">Next watering: In 2 days</p>
          </div>
        </div>
      </div>

      {/* Summary Card Section */}
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 space-y-4 border border-gray-100 w-full sm:w-1/2">
        <h3 className="text-md font-semibold text-gray-800">Watering Summary</h3>

        {/* Sensor Readings */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

      {/* ESP32 Connection */}
      <div className="flex flex-col">
        <div className="flex intems-left sm:items-center gap-1">
          <span className={isConnected ? "text-green-600 text-xl" : "text-red-600 text-xl"}>
            {isConnected ? '🟢' : '🔴'}
          </span>
          <span className="font-medium text-gray-700">ESP32:</span>
        </div>
        <span className={`font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

        {/* Moisture */}
        <div className="flex items-center gap-2">
          <Droplet className="text-blue-600" size={20} />
          <span className="font-medium text-gray-700">Moisture:</span>
          <span
            className="font-bold"
            style={{ color: getStatusColor(plantData.moisture, 'moisture') }}
          >
            {plantData.moisture}%
          </span>
        </div>

        {/* Water Need */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">💧</span>
          <span className="font-medium text-gray-700">Needs Water:</span>
          <span
            className="font-bold"
            style={{ color: plantData.moisture < 30 ? '#ef4444' : '#22c55e' }}
          >
            {plantData.moisture < 30 ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

        {/* Toggle + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <ToggleSwitch
            checked={autoWatering}
            onChange={(e) => setAutoWatering(e.target.checked)}
            id="auto-watering-toggle"
          />
          <label
            htmlFor="auto-watering-toggle"
            className="text-base font-medium text-gray-700 cursor-pointer"
          >
          </label>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            onClick={() => alert('Watering triggered!')}
          >
            Water Now
          </button>
        </div>
      </div>
    </div>

      );
    };

export default PlantStatus;
