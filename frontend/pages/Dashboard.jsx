import PlantStatus from "../components/dashboard/plantStatus";
import sensorReading from "../components/dashboard/sensorReading";
import soilMoisture from "../components/dashboard/soilMoisture";

export default function Dashboard() {
    return (
      <div className="font-montserrat h-auto">
          
          <sensorReading/>
          <PlantStatus/>
          <soilMoisture/>
      </div>
    )
  }