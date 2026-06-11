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
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      {/* Header */}
      <header className="relative mb-10 p-6 rounded-3xl bg-gradient-to-br from-[#0a1f14] via-[#0f2e1d] to-[#1a4a2e] overflow-hidden shadow-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Turkey Agricultural <span className="text-emerald-400">Regions</span> Analysis
          </h1>
          <p className="text-emerald-300/60 text-sm font-medium">
            Click on regions to view average climate values and optimal crop recommendations.
          </p>
        </div>
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
                  navigate(`/regions/${item.id}`);
                }
            } />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
