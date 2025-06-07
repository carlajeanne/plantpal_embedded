import PlantStatus from "../components/dashboard/plantStatus";
import SensorReading from "../components/dashboard/sensorReading";
import SoilMoisture from "../components/dashboard/soilMoisture";

export default function Dashboard() {
    return (
      <div className="font-montserrat h-auto">
          
          <SensorReading/>
          <PlantStatus/>
          <SoilMoisture/>
      </div>
    )
  }