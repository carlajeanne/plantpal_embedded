import PlantStatus from "../components/dashboard/plantStatus";
import SensorReading from "../components/dashboard/sensorReading";
import SoilMoisture from "../components/dashboard/soilMoisture";
import Navbar from "../components/dashboard/navbar";



export default function Dashboard() {
    return (
      <div className="font-montserrat h-auto">
          <Navbar />
          <SensorReading/>
          <PlantStatus/>
          <SoilMoisture/>
      </div>
    )
  }