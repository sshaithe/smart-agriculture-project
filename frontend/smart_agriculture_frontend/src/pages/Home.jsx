import React, { useState } from "react";
import Text from "../components/atomic_design/atom/Text";
import Button from "../components/atomic_design/atom/Button";
import FormField from "../components/atomic_design/modelcule/FormField";
import { observationService } from "../api/ObservationService";
import ObservationModel from "../model/ObservationModel";

const Home = () => {
  const [observation, setObservation] = useState(new ObservationModel({}));

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedData = { ...observation, [id]: value };
    setObservation(new ObservationModel(updatedData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = ObservationModel.toApiPayload(observation);
      const response = await observationService.createObservation(payload);
      console.log("Observation saved successfully:", response);
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-10">
            <div className="text-center mb-10">
              <Text
                children="New Sensor Entry"
                className="text-3xl font-extrabold text-gray-900"
              />
              <Text
                children="Enter the latest agricultural data below."
                className="mt-2 text-gray-600"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. General Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-green-800 border-b pb-2">
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    id="year"
                    label="Observation Year"
                    type="number"
                    value={observation.year}
                    onChange={handleChange}
                    placeholder="2026"
                  />
                  <FormField
                    id="city_id"
                    label="City ID"
                    type="number"
                    value={observation.city_id}
                    onChange={handleChange}
                  />
                  <FormField
                    id="region_id"
                    label="Region ID"
                    type="number"
                    value={observation.region_id}
                    onChange={handleChange}
                  />
                  <FormField
                    id="crop_id"
                    label="Crop ID"
                    type="number"
                    value={observation.crop_id}
                    onChange={handleChange}
                  />
                  <FormField
                    id="latitude"
                    label="Latitude"
                    type="number"
                    step="0.0001"
                    value={observation.latitude}
                    onChange={handleChange}
                  />
                  <FormField
                    id="longitude"
                    label="Longitude"
                    type="number"
                    step="0.0001"
                    value={observation.longitude}
                    onChange={handleChange}
                  />
                </div>
              </section>

              {/* 2. Weather Parameters */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                  Weather Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    id="t2m"
                    label="Avg. Temperature (T2M)"
                    type="number"
                    step="0.1"
                    value={observation.t2m}
                    onChange={handleChange}
                  />
                  <FormField
                    id="t2m_max"
                    label="Max Temperature"
                    type="number"
                    step="0.1"
                    value={observation.t2m_max}
                    onChange={handleChange}
                  />
                  <FormField
                    id="t2m_min"
                    label="Min Temperature"
                    type="number"
                    step="0.1"
                    value={observation.t2m_min}
                    onChange={handleChange}
                  />
                  <FormField
                    id="rh2m"
                    label="Relative Humidity (%)"
                    type="number"
                    step="0.1"
                    value={observation.rh2m}
                    onChange={handleChange}
                  />
                  <FormField
                    id="ws2m"
                    label="Wind Speed (m/s)"
                    type="number"
                    step="0.1"
                    value={observation.ws2m}
                    onChange={handleChange}
                  />
                  <FormField
                    id="prectotcorr"
                    label="Rainfall (mm/day)"
                    type="number"
                    step="0.01"
                    value={observation.prectotcorr}
                    onChange={handleChange}
                  />
                  <FormField
                    id="allsky_sfc_sw_dwn"
                    label="Solar Radiation"
                    type="number"
                    step="0.1"
                    value={observation.allsky_sfc_sw_dwn}
                    onChange={handleChange}
                  />
                </div>
              </section>

              {/* 3. Soil Data */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-amber-800 border-b pb-2">
                  Soil Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    id="soil_temp_0_7"
                    label="Soil Temperature (0-7cm)"
                    type="number"
                    step="0.1"
                    value={observation.soil_temp_0_7}
                    onChange={handleChange}
                  />
                  <FormField
                    id="soil_temp_7_28"
                    label="Soil Temperature (7-28cm)"
                    type="number"
                    step="0.1"
                    value={observation.soil_temp_7_28}
                    onChange={handleChange}
                  />
                  <FormField
                    id="soil_moisture_0_7"
                    label="Soil Moisture (0-7cm)"
                    type="number"
                    step="0.01"
                    value={observation.soil_moisture_0_7}
                    onChange={handleChange}
                  />
                  <FormField
                    id="soil_moisture_7_28"
                    label="Soil Moisture (7-28cm)"
                    type="number"
                    step="0.01"
                    value={observation.soil_moisture_7_28}
                    onChange={handleChange}
                  />
                </div>
              </section>

              {/* Submit Button */}
              <div className="mt-10">
                <Button
                  type="submit"
                  children="Save Observation Data"
                  className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg cursor-pointer transform active:scale-95"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
