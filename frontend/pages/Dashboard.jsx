import PlantStatus from "../components/dashboard/plantStatus";
import SensorReading from "../components/dashboard/sensorReading";
import SoilMoisture from "../components/dashboard/soilMoisture";
import Navbar from "../components/dashboard/navbar";

export default function Dashboard() {
  return (
    <div className="font-montserrat h-auto overflow-hidden">
      <Navbar />

      {/* Group SensorReading and PlantStatus in a flex row */}
      <div className="flex flex-col sm:flex-row gap-4 px-4 py-2">
        {/* SensorReading: fixed width or let it size naturally */}
        <div className="w-full sm:w-[550px]">
          <SensorReading />
        </div>

        {/* PlantStatus: fills remaining horizontal space */}
        <div className="flex-1">
          <PlantStatus />
          <SoilMoisture />
        </div>
      </div>
    </div>
  );
}
