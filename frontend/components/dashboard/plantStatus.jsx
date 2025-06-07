import { Flower } from 'lucide-react'

// Mock data - replace with real data from your backend
const plantData = {
  moisture: 65,
  light: 75,
  temperature: 22,
  status: 'Healthy',
}

const PlantStatus = () => {
  const getStatusColor = (value, type) => {
    switch (type) {
      case 'moisture':
        return value < 30 ? '#f44336' : value < 60 ? '#ff9800' : '#4caf50'
      case 'light':
        return value < 40 ? '#f44336' : value < 70 ? '#ff9800' : '#4caf50'
      case 'temperature':
        return value < 15 ? '#f44336' : value > 30 ? '#f44336' : '#4caf50'
      default:
        return '#4caf50'
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4 text-gray-900">
        Plant Status Overview
      </h2>
      
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-4">
        {/* Plant Icon */}
        <div className="flex justify-center items-center w-20 h-20 sm:w-24 sm:h-24 text-blue-600">
          <Flower size={60} className="sm:w-20 sm:h-20" />
        </div>
        
        {/* Status Information */}
        <div className="flex flex-col gap-1 sm:gap-2 items-center sm:items-start text-center sm:text-left">
          <p className="text-sm sm:text-base text-green-600 font-medium">
            Healthy
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Last checked: 5 minutes ago
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Next watering: In 2 days
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlantStatus