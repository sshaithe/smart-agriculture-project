import React, { useEffect, useState } from "react";
import Text from "../components/atomic_design/atom/Text";
import Table from "../components/atomic_design/organism/Table";
import Button from "../components/atomic_design/atom/Button";
import { observationService } from "../api/ObservationService";
import ObservationModel from "../model/ObservationModel";

const headers = [
  "City",
  "Crop",
  "Year",
  "Temp (°C)",
  "Humidity (%)",
  "Soil Moisture",
];

const Background = () => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const response = await observationService.getAllObservations();

        console.log("Raw data from backend:", response);

        // If backend format is {"observation": [...]} use response.observation
        const rawData =
          response.observation || response.observations || response;
        const array = Array.isArray(rawData) ? rawData : [rawData];

        if (Array.isArray(rawData)) {
          const formattedData = rawData.map((item) =>
            ObservationModel.fromJson(item)
          );
          setObservations(formattedData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const renderActions = (row) => (
    <div className="flex gap-2">
      <Button className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg">
        Details
      </Button>
      <Button className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg">
        Delete
      </Button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <header className="text-center mb-12">
        <Text className="text-4xl font-extrabold text-gray-900">
          Historical Sensor Data
        </Text>
      </header>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        /* Pass fetched state to the data prop */
        <Table
          headers={headers}
          data={observations}
          renderActions={renderActions}
        />
      )}
    </div>
  );
};

export default Background;
