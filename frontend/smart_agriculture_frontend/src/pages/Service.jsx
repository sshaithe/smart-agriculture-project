import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS_DATA } from "../features/map_model";
import Map from "../components/atomic_design/template/Map";
import RegionCard from "../components/atomic_design/modelcule/RegionCard";
import { useState } from "react";

import { regionService } from "../api/RegionService";
import RegionModel from "../model/RegionModel";

const Service = () => {
  const [regions, setRegion] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await regionService.getAllRegions();

        const regionsArray = Array.isArray(data) ? data : data.regions;

        if (regionsArray) {
          const regions = regionsArray.map((item) =>
            RegionModel.fromJson(item),
          );
          setRegion(regions);
        } else {
          console.error("Data format is not the expected array!", data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          Turkey Agricultural Regions Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Click on regions to view average climate values and optimal crop
          recommendations.
        </p>
      </header>

      {/* 1. Map Area */}
      <div className="mb-12">
        <Map />
      </div>

      {/* 2. Region Cards */}
      <div className="id-cards-container">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Regional Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {regions.map((item) => (
            <RegionCard key={item.id} region={item} onClick={
                () => {
                  navigate(`/service/${item.id}`);
                }
            } />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
